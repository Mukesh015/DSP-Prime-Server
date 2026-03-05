import { Router } from "express";
import { exportOfflineReport, exportSMSReportLogs, fetchOfflineReport, fetchSMSReportLogs } from "../controllers/report.controller";

const router = Router();

router.get("/offline", fetchOfflineReport);
router.get("/offline/export", exportOfflineReport);

router.get("/sms", fetchSMSReportLogs);
router.get("/sms/export", exportSMSReportLogs);

export default router;