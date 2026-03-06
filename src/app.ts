import express from "express";
import cors from "cors";
import tankRoutes from "./routes/tank.routes";
import dashboardRoutes from "./routes/dashboard.route";
import analyticsRoutes from "./routes/analytics.route";
import notificationRoutes from "./routes/notification.routes";
import reportRoutes from "./routes/report.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.route";
import { checkOfflineTanks } from "./utils/offlineChecker";

const app = express();

app.use(cors());
app.use(express.json()); ``

app.use("/api/tanks", tankRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

//  Check offline tanks every 15 minutes
setInterval(async () => {
    await checkOfflineTanks();
}, 15 * 60 * 1000); // every 15 minutes

export default app;