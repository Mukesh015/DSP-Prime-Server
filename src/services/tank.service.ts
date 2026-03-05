import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";
import { computeTankMetrics } from "../utils/computeTankMetrics";

export const fetchTankData = async () => {
    const repo = AppDataSource.getRepository(TankData);

    // latest row per tank
    const rows: any[] = await repo.query(`
        SELECT *
        FROM (
        SELECT *,
                ROW_NUMBER() OVER (PARTITION BY tank_no ORDER BY date_time DESC) AS rn
        FROM MQTT_Logs
        ) t
        WHERE rn <= 2
    `);

    const now = new Date();

    const result = TANK_PARAMETERS.map((cfg) => {
        const tankRows = rows.filter((r) => r.tank_no === cfg.tank_no);
        const row = tankRows[0];
        if (!row) {
            return {
                tank_no: cfg.tank_no,
                location: cfg.location,

                tank_volume: cfg.tank_volume,
                upper_safe_limit_pct: cfg.upper_safe_limit_pct,
                lower_safe_limit: cfg.lower_safe_limit,

                liters: 0,
                fillPercent: 0,
                lastUpdated: null,
                border: "red",
                flow: "No Data",
                alert: "No Data",
            };
        }

        const metrics = computeTankMetrics(cfg, Number(row.ultra_height));

        let alertMsg: string | null = null;

        const lastUpdated = new Date(row.date_time);
        const diffMin =
            (now.getTime() - lastUpdated.getTime()) / (1000 * 60);

        const offline = diffMin > 15;

        let border = "green";
        if (offline || metrics.isLowLevel || metrics.isHighLevel) {
            border = "red";
        }

        if (offline) {
            alertMsg = "Device Offline";
        } else if (metrics.isLowLevel) {
            alertMsg = "Low Level";
        } else if (metrics.isHighLevel) {
            alertMsg = "High Level";
        } else {
            alertMsg = "Normal Flow";
        }

        return {
            tank_no: cfg.tank_no,
            location: cfg.location,

            // tank config values (needed for UI scale)
            tank_volume: cfg.tank_volume,
            upper_safe_limit_pct: cfg.upper_safe_limit_pct,
            lower_safe_limit: cfg.lower_safe_limit,

            // live values
            liters: Math.round(metrics.liters),
            fillPercent: metrics.fillPercent.toFixed(2),
            lastUpdated,
            border,
            flow: "No Leakage",
            alert: alertMsg,
        };
    });

    return result;
};