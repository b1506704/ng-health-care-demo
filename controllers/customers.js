import express from "express";

import Customer from "../models/customer.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";

const router = express.Router();

export const getCustomers = (req, res) => {
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
    Customer.paginate({}, options)
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
    const customer = await Customer.find();
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getCustomer = async (req, res) => {
  const { _id } = req.params;
  try {
    const customer = await Customer.findOne({ _id: _id });
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedCustomers = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      await Customer.findOneAndDelete({ _id: selectedItems[i] });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} customer deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Customer not found!" });
  }
};

export const deleteCustomer = async (req, res) => {
  const { _id } = req.params;
  try {
    const customer = await Customer.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `1 Customer deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Customer not found!" });
  }
};

export const deleteAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany({});
    res.status(200).json({ message: "All customers deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createCustomer = async (req, res) => {
  const {
    userName,
    fullName,
    age,
    gender,
    occupation,
    address,
    bloodType,
    height,
    weight,
  } = req.body;
  console.log(req.body);

  try {
    const newCustomer = new Customer({
      userName,
      fullName,
      age,
      gender,
      occupation,
      address,
      bloodType,
      height,
      weight,
    });
    await newCustomer.save();
    res.status(200).json({ message: `Customer ${fullName} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create customer!" });
  }
};

export const filterCustomerByPrice = (req, res) => {
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
    Customer.paginate(query, options)
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

export const filterCustomerByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { bloodType: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Customer.paginate(query, options)
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

export const searchCustomerByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      fullName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Customer.paginate(query, options)
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
    Customer.paginate(query, options)
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
      sort: { age: value },
      offset: offset,
      limit: limit,
    };
    Customer.paginate(query, options)
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

export const generateRandomCustomer = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const genderList = ["Male", "Female"];
      const bloodType = [
        { _id: "0", name: "A" },
        { _id: "1", name: "B" },
        { _id: "2", name: "O" },
      ];
      const nameList = [
        "Elon Musk",
        "Tim Cahill",
        "David De Gea",
        "Manuel Neuer",
        "Phi Minh Long",
        "Au Trung",
        "Thach Sung",
        "Alien",
        "Predator",
      ];
      const randomNumber = random(1, 200);
      const randomBloodType = bloodType[random(0, bloodType.length - 1)]._id;
      const randomName = nameList[random(0, nameList.length - 1)];
      const randomGender = genderList[random(0, genderList.length - 1)];
      const newCustomer = new Customer({
        userName: `user#${randomNumber}`,
        fullName: `${randomName} Clone #${randomNumber}`,
        age: randomNumber,
        gender: randomGender,
        occupation: `Job #${randomNumber}`,
        address: `Location #${randomNumber}`,
        bloodType: randomBloodType,
        height: randomNumber,
        weight: randomNumber,
      });
      await newCustomer.save();
    }
    res.status(200).json({ message: `Customers created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create customer!" });
  }
};

export const updateCustomer = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const customer = await Customer.findOne({ _id: _id });
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customer._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 customer updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
