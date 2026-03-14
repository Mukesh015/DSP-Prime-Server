import { AppDataSource } from "../config/data-source";
import { TANK_PARAMETERS } from "../constants/tankParameters";

const tankTimeoutMap = new Map(
    TANK_PARAMETERS.map(t => [t.tank_no, t.stale_timeout_minutes])
);

export const getOfflineReport = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
) => {

    let searchCondition = "";

    if (search) {
        searchCondition = `
        AND (tank_no LIKE '%${search}%'
        OR device_id LIKE '%${search}%')
        `;
    }

    const rows = await AppDataSource.query(`

    WITH ordered AS (
        SELECT
            tank_no,
            device_id,
            date_time,
            LAG(date_time) OVER (
                PARTITION BY tank_no
                ORDER BY date_time
            ) prev_time
        FROM MQTT_Logs
    ),
    
    gaps AS (
        SELECT
            tank_no,
            device_id,
            prev_time AS offline_time,
            date_time AS online_time,
            TIMESTAMPDIFF(MINUTE, prev_time, date_time) gap_min
        FROM ordered
        WHERE prev_time IS NOT NULL
    )

    SELECT
        tank_no,
        device_id,
        offline_time,
        online_time,
        gap_min
    FROM gaps
    WHERE gap_min IS NOT NULL
    ${searchCondition}
    ORDER BY offline_time DESC

    `);

    const filtered = rows.filter((r: any) => {
        const timeout = tankTimeoutMap.get(r.tank_no) || 15;
        return r.gap_min > timeout;
    });

    const total = filtered.length;

    const paginated = filtered.slice(
        (page - 1) * limit,
        page * limit
    );

    const data = paginated.map((r: any) => {

        const hours = Math.floor(r.gap_min / 60);
        const minutes = r.gap_min % 60;

        return {
            tank_no: r.tank_no,
            device_id: r.device_id,
            offline_time: r.offline_time,
            online_time: r.online_time,
            offline_period: `${hours} hr ${minutes} min`
        };
    });

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getOfflineExportedReport = async (
    start: string,
    end: string
) => {

    const rows = await AppDataSource.query(`

    WITH ordered AS (
        SELECT
            tank_no,
            device_id,
            date_time,
            LAG(date_time) OVER (
                PARTITION BY tank_no
                ORDER BY date_time
            ) prev_time
        FROM MQTT_Logs
        WHERE date_time BETWEEN ? AND ?
    ),

    gaps AS (
        SELECT
            tank_no,
            device_id,
            prev_time AS offline_time,
            date_time AS online_time,
            TIMESTAMPDIFF(MINUTE, prev_time, date_time) gap_min
        FROM ordered
        WHERE prev_time IS NOT NULL
    )

    SELECT
        tank_no,
        device_id,
        offline_time,
        online_time,
        gap_min
    FROM gaps
    ORDER BY offline_time DESC

    `, [start, end]);

    const data = rows
        .filter((r: any) => {
            const timeout = tankTimeoutMap.get(r.tank_no) || 15;
            return r.gap_min > timeout;
        })
        .map((r: any) => {

            const hours = Math.floor(r.gap_min / 60);
            const minutes = r.gap_min % 60;

            return {
                tank_no: r.tank_no,
                device_id: r.device_id,
                offline_time: r.offline_time,
                online_time: r.online_time,
                offline_period: `${hours} hr ${minutes} min`
            };
        });

    return {
        count: data.length,
        data
    };
};

export const getSMSReport = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
) => {

    const offset = (page - 1) * limit;

    const searchCondition = search
        ? `AND (n.tank_no LIKE '%${search}%' OR u.name LIKE '%${search}%')`
        : "";

    const rows = await AppDataSource.query(`
  
    SELECT
      n.id,
      n.tank_no,
      u.name AS user,
      u.phone,
      n.type AS report,
      n.created_at AS time,
      'Sent' AS status
    FROM Tank_Notifications n
    JOIN Users u ON 1=1
    WHERE n.type IN ('overflow','underflow')
    ${searchCondition}
    ORDER BY n.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  
  `);

    const totalRes = await AppDataSource.query(`
  
    SELECT COUNT(*) as count
    FROM Tank_Notifications n
    WHERE n.type IN ('overflow','underflow')
  
  `);

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total: totalRes[0].count,
            totalPages: Math.ceil(totalRes[0].count / limit)
        }
    };
};

export const exportSMSReport = async (
    start: string,
    end: string
) => {

    const rows = await AppDataSource.query(`
  
    SELECT
      n.id,
      n.tank_no,
      u.name AS user,
      u.phone,
      n.type AS report,
      n.created_at AS time,
      'Sent' AS status
    FROM Tank_Notifications n
    JOIN Users u ON 1=1
    WHERE n.type IN ('overflow','underflow')
    AND DATE(n.created_at) BETWEEN ? AND ?
    ORDER BY n.created_at DESC
  
  `, [start, end]);

    return {
        count: rows.length,
        data: rows
    };
};