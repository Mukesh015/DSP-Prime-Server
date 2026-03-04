import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

export const fetchDashboardStats = async (_: Request, res: Response) => {
    try {
        const stats = await getDashboardStats();
        res.json(stats);
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};