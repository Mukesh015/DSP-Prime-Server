import { Request, Response } from "express";
import { fetchTankData } from "../services/tank.service";

export const fetchTankDataController = async (
    _req: Request,
    res: Response
) => {
    try {
        const data = await fetchTankData();

        res.json({
            success: true,
            tanks: data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tank data",
        });
    }
};