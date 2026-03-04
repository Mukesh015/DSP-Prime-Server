import express from "express";
import cors from "cors";
import tankRoutes from "./routes/tank.routes";
import dashboardRoutes from "./routes/dashboard.route";

const app = express();

app.use(cors());
app.use(express.json()); ``

app.use("/api/tanks", tankRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;