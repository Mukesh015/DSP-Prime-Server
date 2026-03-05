import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";

export const getDashboardStats = async () => {
    const repo = AppDataSource.getRepository(TankData);

    const rows: any[] = await repo.query(`
    SELECT t1.*
    FROM MQTT_Logs t1
    INNER JOIN (
        SELECT tank_no, MAX(date_time) AS max_time
        FROM MQTT_Logs
        GROUP BY tank_no
    ) t2
    ON t1.tank_no = t2.tank_no AND t1.date_time = t2.max_time
  `);

    const now = new Date();
    const STALE_TIMEOUT_MINUTES = 15;

    const rowMap = new Map(rows.map((r) => [r.tank_no, r]));

    let online = 0;
    let offline = 0;
    let issues = 0;

    const tanks = TANK_PARAMETERS.map((cfg) => {
        const row = rowMap.get(cfg.tank_no);

        if (!row) {
            offline++;

            return {
                tank_no: cfg.tank_no,
                location: cfg.location,
                status: "offline",
                lastUpdated: null,
                alert: "No Data",
            };
        }

        const lastUpdated = new Date(row.date_time);

        const diff =
            (now.getTime() - lastUpdated.getTime()) / (1000 * 60);

        const isOffline = diff > STALE_TIMEOUT_MINUTES;

        if (isOffline) {
            offline++;
        } else {
            online++;
        }

        if (row.ul_status !== "valid") {
            issues++;
        }

        return {
            tank_no: cfg.tank_no,
            location: cfg.location,
            device_id: cfg.device_id,
            lastUpdated,
            ultra_height: row.ultra_height,
            status: isOffline ? "offline" : "online",
            alert: row.ul_status !== "valid" ? "Sensor Issue" : "Normal",
        };
    });

    return {
        stats: {
            totalTanks: TANK_PARAMETERS.length,
            onlineTanks: online,
            offlineTanks: offline,
            issuesDetected: issues,
        },
        tanks,
    };
};