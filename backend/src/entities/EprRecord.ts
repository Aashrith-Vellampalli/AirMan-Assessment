import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check} from "typeorm";
import {User, UserRole} from "./User";

export { UserRole };

export enum Status{
    DRAFT="draft",
    SUBMITTED="submitted",
    ARCHIVED="archived"
}
@Check(`"overall_rating" >= 1 AND "overall_rating" <= 5`)
@Check(`"technical_skills_rating" >= 1 AND "technical_skills_rating" <= 5`)
@Check(`"non_technical_skills_rating" >= 1 AND "non_technical_skills_rating" <= 5`)
@Entity("epr_records")
export class EprRecord{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @ManyToOne(()=>User,{onDelete:"CASCADE"})
    @JoinColumn({name:"person_id"})
    person!:User;

    @ManyToOne(()=>User,{onDelete:"CASCADE"})
    @JoinColumn({name:"evaluator_id"})
    evaluator!:User;

    @Column({
        type:"enum",
        enum:UserRole
    })
    role_type!:UserRole;

    @Column()
    period_start!:Date;

    @Column()
    period_end!:Date;

    @Column({type:"int"})
    overall_rating!:number;

    @Column({type:"int"})
    technical_skills_rating!:number;

    @Column({type:"int"})
    non_technical_skills_rating!:number;

    @Column({type:"text"})
    remarks!:string;

    @Column({
        type:"enum",
        enum:Status
    })
    status!:Status

    @CreateDateColumn()
    created_at!:Date;

    @UpdateDateColumn()
    updated_at!:Date;
}