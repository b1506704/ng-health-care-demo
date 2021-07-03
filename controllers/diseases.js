import express from "express";

import Disease from "../models/disease.js";

const router = express.Router();

export const getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();

    res.status(200).json(diseases);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteDisease = async (req, res) => {
  const { id } = req.params;
  try {
    const disease = await Disease.findOneAndDelete({ _id: id });
    res.status(200).json(disease);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDisease = async (req, res) => {
  const { name, description } = req.body;

  const newDisease = new Disease({ name, description });

  try {
    await newDisease.save();
    res.status(201).json(newDisease);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateDisease = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const disease = await Disease.findOne({ _id: id });
    const updatedDisease = await Disease.findOneAndUpdate(
      { _id: disease.id },
      { name, description },
      { new: true }
    );
    res.status(200).json(updatedDisease);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
