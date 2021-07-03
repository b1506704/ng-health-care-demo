import express from "express";

import Doctor from "../models/doctor.js";

const router = express.Router();

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await Doctor.findOneAndDelete({ _id: id });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  const { userName, fullName, age, gender, department, description, address } =
    req.body;

  const newDoctor = new Doctor({
    userName,
    fullName,
    age,
    gender,
    department,
    description,
    address,
  });

  try {
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { userName, fullName, age, gender, department, description, address } =
    req.body;
  try {
    const doctor = await Doctor.findOne({ _id: id });
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctor.id },
      { userName, fullName, age, gender, department, description, address },
      { new: true }
    );
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
