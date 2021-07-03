import express from "express";

import MedicalCheckup from "../models/medical_checkup.js";

const router = express.Router();

export const getMedicalCheckups = async (req, res) => {
  try {
    const medicalCheckups = await MedicalCheckup.find();

    res.status(200).json(medicalCheckups);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteMedicalCheckup = async (req, res) => {
  const { id } = req.params;
  try {
    const medicalCheckup = await MedicalCheckup.findOneAndDelete({ _id: id });
    res.status(200).json(medicalCheckup);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createMedicalCheckup = async (req, res) => {
  const { doctorID, customerID, location, startDate } = req.body;

  const newMedicalCheckup = new MedicalCheckup({
    doctorID,
    customerID,
    location,
    startDate,
  });

  try {
    await newMedicalCheckup.save();
    res.status(201).json(newMedicalCheckup);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateMedicalCheckup = async (req, res) => {
  const { id } = req.params;
  const { doctorID, customerID, location, startDate } = req.body;
  try {
    const medicalCheckup = await MedicalCheckup.findOne({ _id: id });
    const updatedMedicalCheckup = await MedicalCheckup.findOneAndUpdate(
      { _id: medicalCheckup.id },
      { doctorID, customerID, location, startDate },
      { new: true }
    );
    res.status(200).json(updatedMedicalCheckup);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
