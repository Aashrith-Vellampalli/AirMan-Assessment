import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { User } from "../entities/User"
import { Enrollment } from "../entities/Enrollment"
import { UserRole } from "../entities/User"
import { EprRecord } from "../entities/EprRecord"
import { ILike } from "typeorm"

export const getPeople = async (req:Request,res:Response)=>{
    try{
        const role = req.query.role as string | undefined;
        const search = req.query.search as string | undefined;
        const enrollRepo=AppDataSource.getRepository(Enrollment)
        const eprRepo = AppDataSource.getRepository(EprRecord)
        const userRepo=AppDataSource.getRepository(User);
        let data = null;
        if(role=="student"){
            data= await userRepo.find({
                select:{
                    id:true,
                    name:true,
                    email:true,
                    role:true
                },
            where: search?
            [
                { role: UserRole.STUDENT, name: ILike(`%${search}%`) },
                { role: UserRole.STUDENT, email: ILike(`%${search}%`) }
            ]
                : { role: UserRole.STUDENT }
            });
        }
        else if(role=="instructor"){
            data =await userRepo.find({
                select:{
                    id:true,
                    name:true,
                    email:true,
                    role:true
                },
            where: search?
            [
                { role: UserRole.INSTRUCTOR, name: ILike(`%${search}%`) },
                { role: UserRole.INSTRUCTOR, email: ILike(`%${search}%`) }
            ]
                : { role: UserRole.INSTRUCTOR }
            })
        }
        else{
            data= await userRepo.find({
                select:{
                    id:true,
                    name:true,
                    email:true,
                    role:true
                },
                where: search? [
                    { name: ILike(`%${search}%`) },
                    { email: ILike(`%${search}%`) }
                ] : {}
            });
        }
        const data_fin = await Promise.all(data.map(async (user)=>{
            if(user.role==UserRole.STUDENT){
                const courseData = await enrollRepo.find({
                    select:{
                        status:true,
                    },
                    relations:{
                        course:true
                    },
                    where:{
                        student:{
                            id:user.id
                        }
                    }
                })
                const courses = courseData.map((enrol)=>({
                    course_name:enrol.course.name,
                    status:enrol.status
                }));
                return { ...user,courses: courses };
            }
            else if(user.role==UserRole.INSTRUCTOR){
                const totEps = await eprRepo.count({
                    where:{
                        evaluator:{
                            id:user.id
                        }
                    }
                })
                return { ...user, total_eprs_written: totEps };
            }
            return user;
        }))
        return res.status(200).json(data_fin);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:`server error`})
    }
}