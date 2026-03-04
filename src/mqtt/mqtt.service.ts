import mqtt from "mqtt";
import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";

export const startMqttListener = () => {
  const repo = AppDataSource.getRepository(TankData);

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

      // Required validation
      if (!payload.device_id || !payload.tank_no || payload.ul_m == null) {
        console.log("⚠️ Missing required fields. Skipped.");
        return;
      }

      const tank = repo.create({
        device_id: payload.device_id,
        tank_no: payload.tank_no,
        date_time: new Date(),              // ✅ SERVER TIME ONLY
        ultra_height: Number(payload.ul_m),
        lidar_height: payload.lidar_height ?? null,
        location: payload.location ?? null,
        ul_status: payload.ul_status ?? null,
      });

      await repo.save(tank);

      console.log("📦 Data Stored (Server Time Used)");
    } catch (err: any) {
      console.error("❌ Insert Error:", err.message);
    }
  });
};