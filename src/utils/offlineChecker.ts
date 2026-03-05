import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TankNotification } from "../entities/TankNotification.entity";

export const checkOfflineTanks = async () => {

    const repo = AppDataSource.getRepository(TankData);
    const notifRepo = AppDataSource.getRepository(TankNotification);

    const rows: any[] = await repo.query(`
      SELECT *
      FROM (
          SELECT *,
          ROW_NUMBER() OVER (PARTITION BY tank_no ORDER BY date_time DESC) rn
          FROM MQTT_Logs
      ) t
      WHERE rn = 1
  `);

    const now = new Date();

    for (const row of rows) {

        const lastTime = new Date(row.date_time);
        const diffMin = (now.getTime() - lastTime.getTime()) / 60000;

        if (diffMin > 15) {

            const existing = await notifRepo.findOne({
                where: {
                    tank_no: row.tank_no,
                    type: "offline"
                },
                order: {
                    created_at: "DESC"
                }
            });

            if (existing) {
                const diff =
                    (now.getTime() - new Date(existing.created_at).getTime()) / 60000;

                if (diff < 15) continue;
            }

            const notif = notifRepo.create({
                tank_no: row.tank_no,
                device_id: row.device_id,
                type: "offline",
                message: "Device offline for more than 15 minutes"
            });

            await notifRepo.save(notif);

            console.log(`⚠️ Offline notification created for ${row.tank_no}`);
        }
    }
};