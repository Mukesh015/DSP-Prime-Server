import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("MQTT_Logs")
export class TankData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    device_id!: string;

    @Column()
    tank_no!: string;

    @Column({ type: "datetime" })
    date_time!: Date;

    @Column({ type: "float", nullable: true })
    ultra_height!: number | null;

    @Column({ type: "float", nullable: true })
    lidar_height!: number | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    location!: string | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    ul_status!: string | null;

    @CreateDateColumn({ type: "datetime" })
    last_inserted!: Date;   // auto server time
}