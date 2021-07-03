import express from "express";

import Bill from "../models/bill.js";

const router = express.Router();

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find();

    res.status(200).json(bills);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findOneAndDelete({ _id: id });
    res.status(200).json(bill);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createBill = async (req, res) => {
  const { prescriptionID, customerID, totalCost } = req.body;

  const newBill = new Bill({ prescriptionID, customerID, totalCost });

  try {
    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateBill = async (req, res) => {
  const { id } = req.params;
  const { prescriptionID, customerID, totalCost } = req.body;
  try {
    const bill = await Bill.findOne({ _id: id });
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: bill.id },
      { prescriptionID, customerID, totalCost },
      { new: true }
    );
    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
