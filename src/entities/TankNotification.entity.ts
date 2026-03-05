import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("Tank_Notifications")
export class TankNotification {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    tank_no!: string;

    @Column()
    device_id!: string;

    @Column()
    type!: string;
    // offline | overflow | underflow | fault

    @Column()
    message!: string;

    @Column({ default: false })
    is_read!: boolean;

    @CreateDateColumn({ type: "datetime" })
    created_at!: Date;
}