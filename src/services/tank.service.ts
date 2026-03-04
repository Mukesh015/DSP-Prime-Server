import { AppDataSource } from "../config/data-source";
import { TankData } from "../entities/TankData.entity";
import { TANK_PARAMETERS } from "../constants/tankParameters";
import { computeTankMetrics } from "../utils/tankCalc";

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
                etf: null,
            };
        }

        const metrics = computeTankMetrics(cfg, Number(row.ultra_height));

        let etf: string | null = null;

        if (tankRows.length >= 2) {
            const latest = tankRows[0];
            const prev = tankRows[1];

            const latestLiters = computeTankMetrics(cfg, Number(latest.ultra_height)).liters;
            const prevLiters = computeTankMetrics(cfg, Number(prev.ultra_height)).liters;

            const diffVolume = latestLiters - prevLiters;

            const diffTime =
                (new Date(latest.date_time).getTime() -
                    new Date(prev.date_time).getTime()) / 60000;

            if (diffTime > 0 && diffVolume !== 0) {

                const rate = diffVolume / diffTime; // liters per minute

                if (rate !== 0) {
                    const remaining = cfg.tank_volume - latestLiters;
                    const minutes = remaining / rate;

                    if (minutes > 0 && minutes < 1e6) {
                        const hrs = Math.floor(minutes / 60);
                        const mins = Math.floor(minutes % 60);

                        etf = `${hrs}h ${mins}m`;
                    }
                }
            }
        }

        const lastUpdated = new Date(row.date_time);
        const diffMin =
            (now.getTime() - lastUpdated.getTime()) / (1000 * 60);

        const offline = diffMin > 15;

        let border = "green";
        if (offline || metrics.isLowLevel) {
            border = "red";
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
            etf
        };
    });

    return result;
};