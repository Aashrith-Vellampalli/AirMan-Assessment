import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

export enum UserRole{
    STUDENT="student",
    ADMIN="admin",
    INSTRUCTOR="instructor"
}

@Entity("users")
export class User{
    @PrimaryGeneratedColumn("uuid")
    id!:string

    @Column()
    name!:string

    @Column({unique:true})
    email!:string

    @Column({
        type:"enum",
        enum:UserRole,
    })
    role!:UserRole

    @CreateDateColumn()
    created_at!:Date

    @UpdateDateColumn()
    updated_at!:Date
}