import { AppDataSource } from "../config/data-source";
import { TANK_PARAMETERS } from "../constants/tankParameters";
import { TankData } from "../entities/TankData.entity";
import { computeTankMetrics } from "../utils/computeTankMetrics";

export const getTankGraphData = async (
    tank_no: string,
    startDate: string,
    endDate: string
) => {

    const repo = AppDataSource.getRepository(TankData);

    const rows = await repo.query(
        `
        SELECT tank_no, ultra_height, date_time
        FROM MQTT_Logs
        WHERE tank_no = ?
        AND date_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        ORDER BY date_time ASC
        `,
        [tank_no, startDate, endDate]
    );

    const cfg = TANK_PARAMETERS.find((t) => t.tank_no === tank_no);

    if (!cfg) {
        return [{ name: "Water Level %", data: [] }];
    }

    const data = rows.map((row: any) => {

        const metrics = computeTankMetrics(cfg, Number(row.ultra_height));

        let percent = Number(metrics.fillPercent.toFixed(2));

        // clamp value between 0 and 100
        percent = Math.max(0, Math.min(percent, 100));

        return [
            new Date(row.date_time).getTime(),
            percent
        ];
    });

    return [
        {
            name: "Water Level %",
            data
        }
    ];
};