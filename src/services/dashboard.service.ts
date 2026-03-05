import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";

export const getDashboardStats = async () => {
    const repo = AppDataSource.getRepository(TankData);

    const latestData = await repo.query(`
    SELECT t1.*
    FROM MQTT_Logs t1
    INNER JOIN (
        SELECT tank_no, MAX(date_time) AS max_time
        FROM MQTT_Logs
        GROUP BY tank_no
    ) t2
    ON t1.tank_no = t2.tank_no AND t1.date_time = t2.max_time
  `);

    const totalTanks = TANK_PARAMETERS.length;

    const now = new Date();
    const STALE_TIMEOUT_MINUTES = 15; // must match tank details API

    let online = 0;
    let offline = 0;
    let issues = 0;

    latestData.forEach((tank: any) => {
        const diff =
            (now.getTime() - new Date(tank.date_time).getTime()) / (1000 * 60);

        const isOffline = diff > STALE_TIMEOUT_MINUTES;

        if (isOffline) {
            offline++;
        } else {
            online++;
        }

        if (tank.ul_status !== "valid") {
            issues++;
        }
    });

    return {
        totalTanks,
        onlineTanks: online,
        offlineTanks: offline,
        issuesDetected: issues,
    };
};