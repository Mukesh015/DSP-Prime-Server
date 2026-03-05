import { Router } from "express";
import { fetchTankGraph } from "../controllers/analytics.controller";

const router = Router();

router.get("/", fetchTankGraph);

export default router;