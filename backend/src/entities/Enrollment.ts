import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./User";
import { Course } from "./Course"

export enum EnrollmentStatus{
    ACTIVE="active",
    COMPLETED="completed",
    DROPPED="dropped"
}

@Entity("enrollments")
export class Enrollment{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @ManyToOne(()=>User,{onDelete:"CASCADE"})
    @JoinColumn({name:"student_id"})
    student!:User;

    @ManyToOne(()=>Course,{onDelete:"CASCADE"})
    @JoinColumn({name:"course_id"})
    course!:Course;

    @Column({
        type:"enum",
        enum:EnrollmentStatus
    })
    status!:EnrollmentStatus;

    @Column()
    start_date!:Date;
}