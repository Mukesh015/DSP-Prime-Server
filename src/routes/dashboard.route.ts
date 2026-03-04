import { Router } from "express";
import { fetchDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", fetchDashboardStats);

export default router;