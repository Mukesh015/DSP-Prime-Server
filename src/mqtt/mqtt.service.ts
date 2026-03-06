import mqtt from "mqtt";
import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TankNotification } from "../entities/TankNotification.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";
import { computeTankMetrics } from "../utils/computeTankMetrics";
import { getTankAlertType } from "../utils/notificationHelper";

export const startMqttListener = () => {
  const repo = AppDataSource.getRepository(TankData);
  const notificationRepo = AppDataSource.getRepository(TankNotification);

  const client = mqtt.connect(
    process.env.MQTT_BROKER || "tcp://119.18.62.146:1883",
    {
      username: process.env.MQTT_USERNAME || undefined,
      password: process.env.MQTT_PASSWORD || undefined,
      reconnectPeriod: 2000,
    }
  );

  client.on("connect", () => {
    console.log("✅ MQTT Connected");
    client.subscribe(process.env.MQTT_TOPIC!, { qos: 1 });
  });

  client.on("error", (err) => {
    console.error("❌ MQTT Error:", err.message);
  });

  client.on("message", async (_, message) => {
    try {
      const payload = JSON.parse(message.toString());
      console.log("📥 Payload:", payload);

      if (!payload.device_id || !payload.tank_no) {
        console.log("⚠️ Missing required fields. Skipped.");
        return;
      }

      let ultraHeight: number | null = null;
      let status = "valid";
      // let status = payload.ul_status ?? "valid";

      // handle invalid readings
      if (payload.ul_m === "N/A" || payload.ul_m == null) {
        ultraHeight = null;
        status = "invalid";
      } else {
        const parsed = Number(payload.ul_m);
        ultraHeight = isNaN(parsed) ? null : parsed;
      }

      const tank = repo.create({
        device_id: payload.device_id,
        tank_no: payload.tank_no,
        date_time: new Date(),
        ultra_height: ultraHeight,
        lidar_height: payload.lidar_height ?? null,
        location: payload.location ?? null,
        ul_status: status,
      });

      await repo.save(tank);

      // --------------------------------
      // Notification Logic
      // --------------------------------

      const cfg = TANK_PARAMETERS.find(
        (t) => t.tank_no === payload.tank_no
      );

      if (!cfg) return;

      let metrics = null;

      if (ultraHeight !== null) {
        metrics = computeTankMetrics(cfg, ultraHeight);
      }

      const alert = getTankAlertType(
        false, // offline can't be checked here
        metrics?.isLowLevel ?? false,
        metrics?.isHighLevel ?? false,
        status
      );

      if (!alert) return;

      // Prevent duplicate alerts
      const lastNotif = await notificationRepo.findOne({
        where: {
          tank_no: payload.tank_no,
          type: alert.type,
        },
        order: {
          created_at: "DESC",
        },
      });

      if (lastNotif) {
        const diff =
          (Date.now() - new Date(lastNotif.created_at).getTime()) / 60000;

        if (diff < 5) {
          // ignore duplicate alert within 5 minutes
          return;
        }
      }

      const notif = notificationRepo.create({
        tank_no: payload.tank_no,
        device_id: payload.device_id,
        type: alert.type,
        message: alert.message,
      });

      await notificationRepo.save(notif);

      console.log("📦 Data Stored + Notification created");

    } catch (err: any) {
      console.error("❌ Insert Error:", err.message);
    }
  });
};