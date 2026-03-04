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
    ultra_height!: number;

    @Column({ type: "float", nullable: true })
    lidar_height!: number;

    @Column({ nullable: true })
    location!: string;

    @Column({ nullable: true })
    ul_status!: string;

    @CreateDateColumn({ type: "datetime" })
    last_inserted!: Date;   // auto server time
}