import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { EprRecord } from "../entities/EprRecord";
import { User, UserRole } from "../entities/User";
import { Status } from "../entities/EprRecord";

interface PostEprBody {
    person_id: string
    evaluator_id: string
    role_type: string
    period_start: string
    period_end: string
    overall_rating: number
    technical_skills_rating: number
    non_technical_skills_rating: number
    remarks: string
    status: Status
}

interface PatchEprBody {
    overall_rating?: number
    technical_skills_rating?: number
    non_technical_skills_rating?: number
    remarks?: string
    status?: Status
}

export const getEpr= async (req:Request,res:Response)=>{
    try{
        const person_id = (req.query.personId as string) || (req.query.personid as string);
        const eprRepo = AppDataSource.getRepository(EprRecord);
        if(person_id){
            const data = await eprRepo.find({
                where:{
                    person:{
                        id:person_id
                    },
                },
                order:{
                    period_start:"DESC"
                }
            })
            return res.status(200).json(data);
        }
        else{
            return res.status(400).json({message:"person id required"})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"server eror"})
    }
}


export const getParticularEpr=async (req:Request,res:Response)=>{
    try{
        const eprid=req.params.id as string;
        const eprRepo = AppDataSource.getRepository(EprRecord);
        const data = await eprRepo.findOne({
            where:{
                id:eprid
            },
            relations:["person","evaluator"]
        })
        if(!data){
            return res.status(404).json({message:"EPR not found"});
        }
        return res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"server eror"})
    }
}

export const postEpr= async (req:Request,res:Response)=>{
    try{
        const body = req.body as PostEprBody;
        if(body.overall_rating<1 || body.overall_rating>5){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }
        if(body.technical_skills_rating<1 || body.technical_skills_rating>5){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }
        if(body.non_technical_skills_rating<1 || body.non_technical_skills_rating>5){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }
        const start = new Date(body.period_start);
        const end = new Date(body.period_end);
        if(end<start){
            return res.status(400).json({message:"periodstart before end"});
        }
        if(!body.person_id || !body.evaluator_id){
            return res.status(400).json({message:"person id and evaluator id are req"}); 
        }

        if(!Object.values(UserRole).includes(body.role_type as UserRole)){
            return res.status(400).json({message:`role_type must be one of: ${Object.values(UserRole).join(", ")}`});
        }


        const userRepo=AppDataSource.getRepository(User);
        const person=await userRepo.findOne({
            where:{
                id:body.person_id
            }
        })
        if(!person){
            return res.status(404).json({message:"person id not found"})
        }

        const evaluator=await userRepo.findOne({
            where:{
                id:body.evaluator_id
            }
        })
        if(!evaluator){
            return res.status(404).json({message:"evaluator id not found"})
        }

        const eprRepo = AppDataSource.getRepository(EprRecord);

        const newEpr=eprRepo.create({
            person,
            evaluator,
            role_type: body.role_type as UserRole,
            period_start: start,
            period_end: end,
            overall_rating: body.overall_rating,
            technical_skills_rating: body.technical_skills_rating,
            non_technical_skills_rating: body.non_technical_skills_rating,
            remarks:body.remarks,
            status:body.status
        })

        const saved = await eprRepo.save(newEpr);

        return res.status(201).json(saved);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"server eror"})
    }
}


export const patchEpr=async (req:Request,res:Response)=>{
    try{
        const id = req.params.id as string;
        const body = req.body as PatchEprBody;

        const eprRepo = AppDataSource.getRepository(EprRecord);

        const epr = await eprRepo.findOne({
            where:{
                id
            }
        })

        if(!epr){
            return res.status(404).json({ message: "EPR not found" });
        }

        if(body.overall_rating && (body.overall_rating<1 || body.overall_rating>5)){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }
        if(body.technical_skills_rating && (body.technical_skills_rating<1 || body.technical_skills_rating>5)){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }
        if(body.non_technical_skills_rating && (body.non_technical_skills_rating<1 || body.non_technical_skills_rating>5)){
            return res.status(400).json({message:"rating btwn 1 to 5"});
        }

        if(body.status && body.status!=Status.SUBMITTED && body.status!=Status.ARCHIVED && body.status!=Status.DRAFT){
            return res.status(400).json({message:"status can be only one of submitted,archived or draft"});
        }

        const update: Partial<Pick<EprRecord, "overall_rating" | "technical_skills_rating" | "non_technical_skills_rating" | "remarks" | "status">> = {};
        if (body.overall_rating !== undefined) update.overall_rating = body.overall_rating;
        if (body.technical_skills_rating !== undefined) update.technical_skills_rating = body.technical_skills_rating;
        if (body.non_technical_skills_rating !== undefined) update.non_technical_skills_rating = body.non_technical_skills_rating;
        if (body.remarks !== undefined) update.remarks = body.remarks;
        if (body.status !== undefined) update.status = body.status;
        Object.assign(epr, update);

        const updated = await eprRepo.save(epr);
        return res.status(200).json(updated);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"server eror"})
    }
}

