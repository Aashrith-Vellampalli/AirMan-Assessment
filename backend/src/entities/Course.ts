import {Entity, PrimaryGeneratedColumn, Column,} from "typeorm";

@Entity("courses")
export class Course{
    @PrimaryGeneratedColumn("uuid")
    id!:string

    @Column({unique:true})
    name!:string

    @Column()
    license_type!:string

    @Column()
    total_required_hours!:number
}