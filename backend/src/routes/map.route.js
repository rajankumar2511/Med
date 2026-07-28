import express from "express";
import { getNearbyDoctors } from "../controllers/map.controller.js";

const router = express.Router();

router.post("/nearby", getNearbyDoctors);

export default router;
