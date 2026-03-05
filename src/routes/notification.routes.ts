import { Router } from "express";
import { exportLogs, fetchNotifications } from "../controllers/notification.controller";

const router = Router();

router.get("/", fetchNotifications);
router.get("/export", exportLogs);

export default router;