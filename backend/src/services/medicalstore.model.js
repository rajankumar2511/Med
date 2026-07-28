import express from "express";
import { protect } from "../middleware/protect.js";
import {addMedicalStore,getNearbyMedicalStores } from "../controllers/medicalStore.controller.js"

const router = express.Router();

router.post(
  "/create",
  addMedicalStore

);
router.post("/getmsdata",getNearbyMedicalStores)

export default router;