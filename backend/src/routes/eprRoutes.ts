import express from "express";
import {getEpr,getParticularEpr,postEpr,patchEpr} from "../controllers/eprController";
const router = express.Router();

router.get('/',getEpr);
router.post('/',postEpr);
router.get('/:id',getParticularEpr);
router.patch('/:id',patchEpr)

export default router