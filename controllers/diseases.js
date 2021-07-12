import express from "express";

import Disease from "../models/disease.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";
import diseaseTypeList from "../middleware/mock-disease-type.js";

const router = express.Router();

export const getDiseases = (req, res) => {
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
    Disease.paginate({}, options)
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
    const disease = await Disease.find();
    if (disease) {
      res.status(200).json(disease);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getDisease = async (req, res) => {
  const { _id } = req.params;
  try {
    const disease = await Disease.findOne({ _id: _id });
    if (disease) {
      res.status(200).json(disease);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedDiseases = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      await Disease.findOneAndDelete({ _id: selectedItems[i] });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} disease deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Disease not found!" });
  }
};

export const deleteDisease = async (req, res) => {
  const { _id } = req.params;
  try {
    const disease = await Disease.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `1 Disease deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Disease not found!" });
  }
};

export const deleteAllDiseases = async (req, res) => {
  try {
    await Disease.deleteMany({});
    res.status(200).json({ message: "All diseases deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createDisease = async (req, res) => {
  const { name, type, description } = req.body;
  console.log(req.body);

  try {
    const newDisease = new Disease({ name, type, description });
    await newDisease.save();
    res.status(200).json({ message: `Disease ${name} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create disease!" });
  }
};

export const filterDiseaseByPrice = (req, res) => {
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
    Disease.paginate(query, options)
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

export const filterDiseaseByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { type: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Disease.paginate(query, options)
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

export const searchDiseaseByName = (req, res) => {
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
    Disease.paginate(query, options)
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
    Disease.paginate(query, options)
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
    Disease.paginate(query, options)
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

export const generateRandomDisease = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const randomNumber = random(1, 20000);
      const diseaseType =
        diseaseTypeList()[random(0, diseaseTypeList().length - 1)];
      const newDisease = new Disease({
        name: `${diseaseType.name} illness ${random(1, 100)}`,
        type: diseaseType._id,
        description: `Cause various pain # ${diseaseType._id}`,
      });
      await newDisease.save();
    }
    res.status(200).json({ message: `Diseases created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create disease!" });
  }
};

export const updateDisease = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const disease = await Disease.findOne({ _id: _id });
      const updatedDisease = await Disease.findOneAndUpdate(
        { _id: disease._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 disease updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
