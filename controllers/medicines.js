import express from "express";

import Medicine from "../models/medicine.js";

const router = express.Router();

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.status(200).json(medicines);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: id });
    res.status(200).json(medicine);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createMedicine = async (req, res) => {
  const { name, price, brand, effect } = req.body;

  const newMedicine = new Medicine({ name, price, brand, effect });

  try {
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const { name, price, brand, effect } = req.body;
  try {
    const medicine = await Medicine.findOne({ _id: id });
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: medicine.id },
      { name, price, brand, effect },
      { new: true }
    );
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
