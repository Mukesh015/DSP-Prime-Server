import { Request, Response } from "express";
import { getNotificationsForExport, getNotifications } from "../services/notification.service";

export const fetchNotifications = async (req: Request, res: Response) => {
    try {

        const page = parseInt(String(req.query.page ?? 1));
        const limit = parseInt(String(req.query.limit ?? 10));
        const search = String(req.query.search ?? "");

        const result = await getNotifications(page, limit, search);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {

        console.error("Notification fetch error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });

    }
};

export const exportLogs = async (req: Request, res: Response) => {
    try {

        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: "start and end date required"
            });
        }

        const data = await getNotificationsForExport(
            String(start),
            String(end)
        );

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {

        console.error("Export error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch logs"
        });

    }
};