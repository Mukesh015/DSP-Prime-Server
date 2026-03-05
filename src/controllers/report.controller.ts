import { Request, Response } from "express";
import { getOfflineReport, getOfflineExportedReport, getSMSReport, exportSMSReport } from "../services/report.service";

export const fetchOfflineReport = async (
    req: Request,
    res: Response
) => {

    try {

        const page = parseInt(String(req.query.page ?? 1));
        const limit = parseInt(String(req.query.limit ?? 10));
        const search = String(req.query.search ?? "");

        const result = await getOfflineReport(page, limit, search);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {

        console.error("Offline report error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch offline report"
        });

    }
};

export const exportOfflineReport = async (
    req: Request,
    res: Response
) => {
    try {

        const start = String(req.query.start);
        const end = String(req.query.end);

        const result = await getOfflineExportedReport(start, end);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {

        console.error("Export offline report error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to export offline report"
        });

    }
};

export const fetchSMSReportLogs = async (req: Request, res: Response) => {

    try {

        const page = parseInt(String(req.query.page ?? 1));
        const limit = parseInt(String(req.query.limit ?? 10));
        const search = String(req.query.search ?? "");

        const result = await getSMSReport(page, limit, search);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {

        console.error("SMS report error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SMS report"
        });

    }

};

export const exportSMSReportLogs = async (
    req: Request,
    res: Response
) => {

    try {

        const start = String(req.query.start);
        const end = String(req.query.end);

        const result = await exportSMSReport(start, end);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {

        console.error("Export SMS report error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to export SMS report"
        });

    }

};