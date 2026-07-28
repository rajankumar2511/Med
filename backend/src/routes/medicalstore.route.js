// src/routes/medicalstore.route.js

import express from "express";
import MedicalStore from "../models/medicalstore.model.js";

const router = express.Router();

// Create a new medical store
router.post("/", async (req, res) => {
  try {
    const medicalStore = await MedicalStore.create(req.body);

    res.status(201).json({
      success: true,
      data: medicalStore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all medical stores
router.get("/", async (req, res) => {
  try {
    const medicalStores = await MedicalStore.find();

    res.status(200).json({
      success: true,
      count: medicalStores.length,
      data: medicalStores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get medical store by ID
router.get("/:id", async (req, res) => {
  try {
    const medicalStore = await MedicalStore.findById(req.params.id);

    if (!medicalStore) {
      return res.status(404).json({
        success: false,
        message: "Medical store not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicalStore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update medical store
router.put("/:id", async (req, res) => {
  try {
    const medicalStore = await MedicalStore.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicalStore) {
      return res.status(404).json({
        success: false,
        message: "Medical store not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicalStore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete medical store
router.delete("/:id", async (req, res) => {
  try {
    const medicalStore = await MedicalStore.findByIdAndDelete(req.params.id);

    if (!medicalStore) {
      return res.status(404).json({
        success: false,
        message: "Medical store not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical store deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;