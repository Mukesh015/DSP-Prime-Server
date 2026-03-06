import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Users" })

export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 20 })
    phone!: string;
}