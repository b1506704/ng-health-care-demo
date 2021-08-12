import express from "express";
import Prescription from "../models/prescription.js";
import getPagination from "../middleware/getPagination.js";
import Bill from "../models/bill.js";
import MedicalCheckup from "../models/medical_checkup.js";
const router = express.Router();

export const getPrescriptions = (req, res) => {
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
    Prescription.paginate({}, options)
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

export const getPrescriptionsByCustomerID = (req, res) => {
  const { page, size, customerID } = req.query;
  console.log(`Page: ${page}  Size: ${size}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Prescription.paginate(
      {
        customerID: customerID,
      },
      options
    )
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
    const prescription = await Prescription.find();
    if (prescription) {
      res.status(200).json(prescription);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getPrescription = async (req, res) => {
  const { _id } = req.params;
  try {
    const prescription = await Prescription.findOne({ _id: _id });
    if (prescription) {
      res.status(200).json(prescription);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getPrescriptionByCustomerID = async (req, res) => {
  const { customerID } = req.query;
  try {
    const prescription = await Prescription.findOne({
      customerID: customerID,
    });
    if (prescription) {
      res.status(200).json(prescription);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getPrescriptionByMedicalCheckupID = async (req, res) => {
  const { medicalCheckupID } = req.query;
  try {
    const prescription = await Prescription.findOne({
      medicalCheckupID: medicalCheckupID,
    });
    if (prescription) {
      res.status(200).json(prescription);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedPrescriptions = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const deletedPrescription = await Prescription.findOneAndDelete({
        _id: selectedItems[i],
      });
      await Bill.findOneAndDelete({
        prescriptionID: deletedPrescription.prescriptionID,
      });
      console.log(`Bill with ${deletedPrescription.prescriptionID} removed`);
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} prescription deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
  }
};

export const deletePrescription = async (req, res) => {
  const { _id } = req.params;
  try {
    const prescription = await Prescription.findOneAndDelete({ _id: _id });
    await Bill.findOneAndDelete({
      prescriptionID: prescription.prescriptionID,
    });
    console.log(`Bill with ${prescription.prescriptionID} removed`);
    res.status(200).json({ message: `1 prescription deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
  }
};

export const deleteAllPrescriptions = async (req, res) => {
  try {
    await Prescription.deleteMany({});
    await Bill.deleteMany({});
    res.status(200).json({ message: "All prescriptions deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createPrescription = async (req, res) => {
  const {
    medicalCheckupID,
    doctorID,
    doctorName,
    customerID,
    customerName,
    diseaseList,
    medicineList,
    htmlMarkUp,
    advice,
  } = req.body;
  console.log(req.body);
  try {
    const newPrescription = new Prescription({
      medicalCheckupID,
      doctorID,
      doctorName,
      customerID,
      customerName,
      diseaseList,
      medicineList,
      htmlMarkUp,
      advice,
    });
    await newPrescription.save();
    await MedicalCheckup.findOneAndUpdate(
      {
        _id: medicalCheckupID,
      },
      {
        status: "complete",
        priority: 1,
        doctorID: doctorID,
      }
    );
    console.log(`Update checkup ${medicalCheckupID}`);
    res.status(200).json({
      message: `Prescription of ${customerName} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create prescription!" });
  }
};

export const filterPrescriptionByCategory = (req, res) => {
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
    Prescription.paginate(query, options)
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

export const searchPrescriptionByName = (req, res) => {
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
    Prescription.paginate(query, options)
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
    Prescription.paginate(query, options)
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
    Prescription.paginate(query, options)
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

export const updatePrescription = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const prescription = await Prescription.findOne({ _id: _id });
      const updatedPrescription = await Prescription.findOneAndUpdate(
        { _id: prescription._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 prescription updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
