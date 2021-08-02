import express from "express";

import Medicine from "../models/medicine.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";
import brandList from "../middleware/mock-brand.js";

const router = express.Router();

export const getMedicines = (req, res) => {
  const { page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate({}, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const fetchAll = async (req, res) => {
  try {
    const medicine = await Medicine.find();
    if (medicine) {
      res.status(200).json(medicine);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getMedicine = async (req, res) => {
  const { _id } = req.params;
  try {
    const medicine = await Medicine.findOne({ _id: _id });
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
    res.status(200).json({ message: `1 Medicine deleted` });
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

export const filterMedicineByPrice = (req, res) => {
  const { criteria, value, page, size } = req.query;
  console.log(
    `Page: ${page}  Size: ${size}. Criteria: ${criteria} Value: ${value}`
  );
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    let query = {};
    switch (criteria) {
      case "=":
        query = {
          price: value,
        };
        break;
      case "<":
        query = {
          price: { $lt: value },
        };
        break;
      case ">":
        query = {
          price: { $gt: value },
        };
        break;
      case ">=":
        query = {
          price: { $gte: value },
        };
        break;
      case "<=":
        query = {
          price: { $lte: value },
        };
        break;
      case "!=":
        query = {
          price: { $ne: value },
        };
        break;
      default:
        break;
    }
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const filterMedicineByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { brand: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const searchMedicineByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      name: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const sortByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {};
    // value = desc || asc
    const options = {
      sort: { name: value },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const sortByNumber = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {};
    // value = desc || asc
    const options = {
      sort: { price: value },
      offset: offset,
      limit: limit,
    };
    Medicine.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const generateRandomMedicine = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const randomNumber = random(1, 20000);
      const newMedicine = new Medicine({
        name: "Favipiravir" + randomNumber,
        price: randomNumber,
        brand: brandList()[random(0, brandList().length - 1)].name,
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
