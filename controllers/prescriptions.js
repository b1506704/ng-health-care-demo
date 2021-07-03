import express from "express";

import Prescription from "../models/prescription.js";

const router = express.Router();

export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    const prescription = await Prescription.findOneAndDelete({ _id: id });
    res.status(200).json(prescription);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  const { customerID, doctorID, diseaseList, medicineList, advice, created } =
    req.body;

  const newPrescription = new Prescription({
    customerID,
    doctorID,
    diseaseList,
    medicineList,
    advice,
    created,
  });

  try {
    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { customerID, doctorID, diseaseList, medicineList, advice, created } =
    req.body;
  try {
    const prescription = await Prescription.findOne({ _id: id });
    const updatedPrescription = await Prescription.findOneAndUpdate(
      { _id: prescription.id },
      { customerID, doctorID, diseaseList, medicineList, advice, created },
      { new: true }
    );
    res.status(200).json(updatedPrescription);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
