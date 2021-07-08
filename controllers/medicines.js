import express from "express";

import Medicine from "../models/medicine.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";

const router = express.Router();

export const getMedicines = (req, res) => {
  const { page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    Medicine.paginate({}, { offset, limit })
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findOne({ _id: id });
    if (medicine) {
      res.status(200).json(medicine);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedMedicines = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      await Medicine.findOneAndDelete({ _id: selectedItems[i] });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} medicine deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Medicine not found!" });
  }
};

export const deleteMedicine = async (req, res) => {
  const { _id } = req.params;
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `Medicine ${medicine.name} deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Medicine not found!" });
  }
};

export const deleteAllMedicines = async (req, res) => {
  try {
    await Medicine.deleteMany({});
    res.status(200).json({ message: "All medicines deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createMedicine = async (req, res) => {
  const { name, price, brand, effect } = req.body;
  console.log(req.body);

  try {
    const newMedicine = new Medicine({ name, price, brand, effect });
    await newMedicine.save();
    res.status(200).json({ message: `Medicine ${name} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create medicine!" });
  }
};

export const generateRandomMedicine = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const randomNumber = random(1, 20000);
      const newMedicine = new Medicine({
        name: "Favipiravir" + randomNumber,
        price: randomNumber,
        brand: "Tesla",
        effect: "Effect to cure illness #" + randomNumber,
      });
      await newMedicine.save();
    }
    res.status(200).json({ message: `Medicines created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create medicine!" });
  }
};

export const updateMedicine = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const medicine = await Medicine.findOne({ _id: _id });
      const updatedMedicine = await Medicine.findOneAndUpdate(
        { _id: medicine._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 medicine updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
