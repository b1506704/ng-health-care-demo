import express from "express";

import MedicalCheckup from "../models/medical_checkup.js";
import getPagination from "../middleware/getPagination.js";
import Prescription from "../models/prescription.js";
const router = express.Router();

export const getMedicalCheckups = (req, res) => {
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
    MedicalCheckup.paginate({}, options)
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
    const medicalCheckup = await MedicalCheckup.find();
    if (medicalCheckup) {
      res.status(200).json(medicalCheckup);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getMedicalCheckup = async (req, res) => {
  const { _id } = req.params;
  try {
    const medicalCheckup = await MedicalCheckup.findOne({ _id: _id });
    if (medicalCheckup) {
      res.status(200).json(medicalCheckup);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getMedicalCheckupByPrescriptionID = async (req, res) => {
  const { prescriptionID } = req.query;
  try {
    const medicalCheckup = await MedicalCheckup.findOne({
      prescriptionID: prescriptionID,
    });
    if (medicalCheckup) {
      res.status(200).json(medicalCheckup);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedMedicalCheckups = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const deletedMedicalCheckup = await MedicalCheckup.findOneAndDelete({
        _id: selectedItems[i],
      });
      await Prescription.findOneAndDelete({
        prescriptionID: deletedMedicalCheckup.prescriptionID,
      });
      console.log(
        `Prescription ${deletedMedicalCheckup.prescriptionID} removed`
      );
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} medical checkup deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
  }
};

export const deleteMedicalCheckup = async (req, res) => {
  const { _id } = req.params;
  try {
    const medicalCheckup = await MedicalCheckup.findOneAndDelete({ _id: _id });
    await Prescription.findOneAndDelete({
      prescriptionID: medicalCheckup.prescriptionID,
    });
    console.log(`Prescription ${medicalCheckup.prescriptionID} removed`);
    res.status(200).json({ message: `1 medical checkup deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
  }
};

export const deleteAllMedicalCheckups = async (req, res) => {
  try {
    await MedicalCheckup.deleteMany({});
    await Prescription.deleteMany({});
    res.status(200).json({ message: "All medical checkups deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createMedicalCheckup = async (req, res) => {
  const {
    doctorID,
    customerID,
    prescriptionID,
    priority,
    healthEnsurance,
    location,
    purpose,
    status,
    startDate,
  } = req.body;
  console.log(req.body);

  try {
    const newMedicalCheckup = new MedicalCheckup({
      doctorID,
      customerID,
      prescriptionID,
      priority,
      healthEnsurance,
      location,
      purpose,
      status,
      startDate,
    });
    await newMedicalCheckup.save();
    const newPrescription = new Prescription({
      prescriptionID: prescriptionID,
      customerID: customerID,
      doctorID: doctorID,
      diseaseList: [],
      medicineList: [],
      htmlMarkUp: "",
      advice: "",
    });
    await newPrescription.save();
    console.log(`Prescription ${prescriptionID} created`);
    res.status(200).json({
      message: `Medical checkup #${priority} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create medicalCheckup!" });
  }
};

export const filterMedicalCheckupByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { status: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    MedicalCheckup.paginate(query, options)
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

export const searchMedicalCheckupByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      fullName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { prescriptionID: "desc" },
      offset: offset,
      limit: limit,
    };
    MedicalCheckup.paginate(query, options)
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
    MedicalCheckup.paginate(query, options)
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
      sort: { priority: value },
      offset: offset,
      limit: limit,
    };
    MedicalCheckup.paginate(query, options)
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

export const updateMedicalCheckup = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const medicalCheckup = await MedicalCheckup.findOne({ _id: _id });
      const updatedMedicalCheckup = await MedicalCheckup.findOneAndUpdate(
        { _id: medicalCheckup._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 medicalCheckup updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
