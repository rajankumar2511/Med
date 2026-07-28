import express from "express";
import { protect } from "../middleware/protect.js";
import {
 doctorFinderAgent
} from "../controllers/agenticai.controller.js";

const router = express.Router();

router.post("/doctor-finder", doctorFinderAgent);


export default router;
