import app from "./app";
import { AppDataSource } from "./config/data-source";
import { startMqttListener } from "./mqtt/mqtt.service";

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database Connected");

        startMqttListener();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ DB Error:", err);
    });