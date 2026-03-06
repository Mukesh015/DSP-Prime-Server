import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";
import { computeTankMetrics } from "../utils/computeTankMetrics";

export const fetchTankData = async () => {
    const repo = AppDataSource.getRepository(TankData);

    const rows: any[] = await repo.query(`
    SELECT *
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY tank_no ORDER BY date_time DESC) AS rn
      FROM MQTT_Logs
    ) t
    WHERE rn = 1
  `);

    const now = new Date();
    const rowMap = new Map(rows.map((r) => [r.tank_no, r]));

    const result = TANK_PARAMETERS.map((cfg) => {
        const row = rowMap.get(cfg.tank_no);

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

        const dbTime = new Date(row.date_time);
        const diffMin = (now.getTime() - dbTime.getTime()) / (1000 * 60);
        const offline = diffMin > 15;

        const istTime = new Date(
            dbTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );

        // 🚨 Device fault handling
        if (row.ul_status === "invalid") {
            return {
                tank_no: cfg.tank_no,
                location: cfg.location,

                tank_volume: cfg.tank_volume,
                upper_safe_limit_pct: cfg.upper_safe_limit_pct,
                lower_safe_limit: cfg.lower_safe_limit,

                liters: 0,
                fillPercent: 0,
                lastUpdated: istTime,
                border: "red",
                flow: "Sensor Fault",
                alert: "Sensor Fault",
            };
        }

        // Normal metric calculation
        const metrics = computeTankMetrics(cfg, Number(row.ultra_height));

        let border = "green";
        let alertMsg = "Normal Flow";
        let flowStatus = "No Leakage";
        let msg = "";

        if (offline) {
            border = "red";
            alertMsg = "Network issue";
            msg = "network_issue";
            if (metrics.isLowLevel) {
                flowStatus = "low_level";
            } else if (metrics.isHighLevel) {
                flowStatus = "high_level";
            }
        } else if (metrics.isLowLevel) {
            alertMsg = "Low Level";
            msg = "low_level";
            flowStatus = "low_level";

        } else if (metrics.isHighLevel) {
            alertMsg = "High Level";
            msg = "high_level";
            flowStatus = "high_level";
        }

        return {
            tank_no: cfg.tank_no,
            location: cfg.location,

            tank_volume: cfg.tank_volume,
            upper_safe_limit_pct: cfg.upper_safe_limit_pct,
            lower_safe_limit: cfg.lower_safe_limit,

            liters: Math.round(metrics.liters),
            fillPercent: metrics.fillPercent.toFixed(2),
            lastUpdated: istTime,
            msg,
            border,
            flow: flowStatus,
            alert: alertMsg,
        };
    });

    return result;
};