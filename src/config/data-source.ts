import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { TankData } from "../entities/TankData.entity";
import { TankNotification } from "../entities/TankNotification.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // ❗ disable in production
    logging: false,
    entities: [TankData, TankNotification],
});