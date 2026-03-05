import { AppDataSource } from "../config/data-source";
import { TankNotification } from "../entities/TankNotification.entity";

export const getNotifications = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
) => {

    const repo = AppDataSource.getRepository(TankNotification);

    const skip = (page - 1) * limit;

    const qb = repo
        .createQueryBuilder("n")
        .orderBy("n.created_at", "DESC")
        .skip(skip)
        .take(limit);

    if (search && search.trim() !== "") {
        qb.where(
            "n.tank_no LIKE :search OR n.type LIKE :search OR n.message LIKE :search",
            { search: `%${search}%` }
        );
    }

    const [data, total] = await qb.getManyAndCount();

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getNotificationsForExport = async (
    start: string,
    end: string
) => {

    const rows = await AppDataSource.query(
        `
    SELECT 
      id,
      tank_no,
      device_id,
      type,
      message,
      is_read,
      created_at
    FROM Tank_Notifications
    WHERE DATE(created_at) BETWEEN ? AND ?
    ORDER BY created_at DESC
    `,
        [start, end]
    );

    return rows;
};