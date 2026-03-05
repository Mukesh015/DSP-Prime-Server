import { Request, Response } from "express";
import { getTankGraphData } from "../services/analytics.service";

export const fetchTankGraph = async (req: Request, res: Response) => {
  try {
    const { tank_no, start_date, end_date } = req.query;

    const series = await getTankGraphData(
      String(tank_no),
      String(start_date),
      String(end_date)
    );

    res.json({
      success: true,
      series,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch graph data",
    });
  }
};