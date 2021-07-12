import express from "express";

import Bill from "../models/bill.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";

const router = express.Router();

export const getBills = (req, res) => {
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
    Bill.paginate({}, options)
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
    const bill = await Bill.find();
    if (bill) {
      res.status(200).json(bill);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getBill = async (req, res) => {
  const { _id } = req.params;
  try {
    const bill = await Bill.findOne({ _id: _id });
    if (bill) {
      res.status(200).json(bill);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedBills = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      await Bill.findOneAndDelete({ _id: selectedItems[i] });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} bill deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Bill not found!" });
  }
};

export const deleteBill = async (req, res) => {
  const { _id } = req.params;
  try {
    const bill = await Bill.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `1 Bill deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Bill not found!" });
  }
};

export const deleteAllBills = async (req, res) => {
  try {
    await Bill.deleteMany({});
    res.status(200).json({ message: "All bills deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createBill = async (req, res) => {
  const { prescriptionID, customerID, totalCost, healthInsurance } = req.body;
  console.log(req.body);

  try {
    const newBill = new Bill({
      prescriptionID,
      customerID,
      totalCost,
      healthInsurance,
    });
    await newBill.save();
    res.status(200).json({ message: `Bill ${prescriptionID} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create bill!" });
  }
};

export const filterBillByPrice = (req, res) => {
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
          age: value,
        };
        break;
      case "<":
        query = {
          age: { $lt: value },
        };
        break;
      case ">":
        query = {
          age: { $gt: value },
        };
        break;
      case ">=":
        query = {
          age: { $gte: value },
        };
        break;
      case "<=":
        query = {
          age: { $lte: value },
        };
        break;
      case "!=":
        query = {
          age: { $ne: value },
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
    Bill.paginate(query, options)
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

export const filterBillByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { healthInsurance: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Bill.paginate(query, options)
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

export const searchBillByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      prescriptionID: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Bill.paginate(query, options)
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
    Bill.paginate(query, options)
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
      sort: { totalCost: value },
      offset: offset,
      limit: limit,
    };
    Bill.paginate(query, options)
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

export const generateRandomBill = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const healthInsuranceList = [
        { _id: "0", name: 'YES' },
        { _id: "1", name: 'NO' },
      ];
      const randomNumber = random(1, 200);
      const randomHealthInsurance =
        healthInsuranceList[random(0, healthInsuranceList.length - 1)].name;
      const newBill = new Bill({
        prescriptionID: `presc#${randomNumber}`,
        customerID: `customer#${randomNumber}`,
        totalCost: randomNumber,
        healthInsurance: randomHealthInsurance,
      });
      await newBill.save();
    }
    res.status(200).json({ message: `Bills created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create bill!" });
  }
};

export const updateBill = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const bill = await Bill.findOne({ _id: _id });
      const updatedBill = await Bill.findOneAndUpdate(
        { _id: bill._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 bill updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
