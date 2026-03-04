import { Router } from "express";
import { fetchTankDataController } from "../controllers/tank.controller";

const router = Router();

router.get("/", fetchTankDataController);

export default router;