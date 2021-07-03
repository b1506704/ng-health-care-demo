import express from "express";

import Customer from "../models/customer.js";

const router = express.Router();

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findOneAndDelete({ _id: id });
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  const { userName, fullName, age, gender, occupation, address, bloodType } =
    req.body;

  const newCustomer = new Customer({
    userName,
    fullName,
    age,
    gender,
    occupation,
    address,
    bloodType,
  });

  try {
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { userName, fullName, age, gender, occupation, address, bloodType } =
    req.body;
  try {
    const customer = await Customer.findOne({ _id: id });
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customer.id },
      { userName, fullName, age, gender, occupation, address, bloodType },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
