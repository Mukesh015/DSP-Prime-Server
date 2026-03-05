import express from "express";
import cors from "cors";
import tankRoutes from "./routes/tank.routes";
import dashboardRoutes from "./routes/dashboard.route";
import analyticsRoutes from "./routes/analytics.route";

const app = express();

app.use(cors());
app.use(express.json()); ``

app.use("/api/tanks", tankRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;