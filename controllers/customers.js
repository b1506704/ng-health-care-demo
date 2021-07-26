import express from "express";

import Customer from "../models/customer.js";
import User from "../models/user.js";
import Room from "../models/room.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";
import cryptMessage from "../middleware/cryptMessage.js";
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

export const getCustomerByUserName = async (req, res) => {
  const { userName } = req.query;
  try {
    const customer = await Customer.findOne({ userName: userName });
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
      const deletedCustomer = await Customer.findOneAndDelete({
        _id: selectedItems[i],
      });
      await User.findOneAndDelete({ userName: deletedCustomer.userName });
      const assignedRoom = await Room.findOne({
        number: deletedCustomer.assignedRoom,
      });
      await Customer.findOneAndUpdate(
        {
          userName: deletedCustomer.userName,
        },
        {
          assignedRoom: null,
        },
        { new: true }
      );
      const updatedRoom = await Room.findOneAndUpdate(
        {
          number: assignedRoom.number,
        },
        {
          $pull: { customerID: { userName: deletedCustomer.userName } },
          vacancyStatus: "AVAILABLE",
        },
        { new: true }
      );
      console.log(
        `User ${deletedCustomer.userName} removed from room: ${updatedRoom.number}`
      );
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
    await User.findOneAndDelete({ userName: customer.userName });
    const assignedRoom = await Room.findOne({ number: customer.assignedRoom });
    await Customer.findOneAndUpdate(
      {
        userName: customer.userName,
      },
      {
        assignedRoom: null,
      },
      { new: true }
    );
    const updatedRoom = await Room.findOneAndUpdate(
      {
        number: assignedRoom.number,
      },
      {
        $pull: { customerID: { userName: customer.userName } },
        vacancyStatus: "AVAILABLE",
      },
      { new: true }
    );
    console.log(
      `User ${customer.userName} removed from room: ${updatedRoom.number}`
    );
    res.status(200).json({ message: `1 Customer deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Customer not found!" });
  }
};

export const deleteAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany({});
    await User.deleteMany({ role: "Customer" });
    await Room.updateMany({}, { $set: { customerID: [] } });
    res.status(200).json({ message: "All customers deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createCustomer = async (req, res) => {
  const {
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
    const userList = await User.find();
    let index = userList.length + 1;
    let userName = `user#${index}`;
    let check = await User.findOne({ userName: userName });
    while (check !== null) {
      index = index + 1;
      userName = `user#${index}`;
      console.log(index);
      check = await User.findOne({ userName: userName });
    }
    const newCustomer = new Customer({
      userName: userName,
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
    const newUser = new User({
      userName: userName,
      passWord: userName,
      role: "Customer",
    });
    newUser.passWord = await cryptMessage(userName);
    await newUser.save();
    const randomRoom = await Room.findOne({ vacancyStatus: "AVAILABLE" });
    await Customer.findOneAndUpdate(
      {
        userName: userName,
      },
      {
        assignedRoom: randomRoom.number,
      },
      { new: true }
    );
    const updatedRoom = await Room.findOneAndUpdate(
      {
        number: randomRoom.number,
      },
      {
        $push: { customerID: newCustomer },
      },
      { new: true }
    );
    if (randomRoom.customerID.length === randomRoom.totalSlot - 1) {
      await Room.findOneAndUpdate(
        {
          number: randomRoom.number,
        },
        {
          vacancyStatus: "FULL",
        },
        { new: true }
      );
    }
    console.log(`User ${userName} assigned to room: ${updatedRoom.number}`);
    res.status(200).json({
      message: `Customer ${fullName} created. Assigned room: ${updatedRoom.number}`,
    });
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

export const filterCustomerByJob = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { occupation: value };
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

export const filterCustomerByGender = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { gender: value };
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
    for (let i = 0; i < 10; i++) {
      const genderList = ["Male", "Female"];
      const bloodType = [
        { _id: "0", name: "A" },
        { _id: "1", name: "B" },
        { _id: "2", name: "O" },
      ];
      const nameList = ["Alpha", "Beta", "Gama", "Alien", "Predator"];
      const jobList = [
        "Student",
        "Teacher",
        "Thief",
        "Space Pirate",
        "Spaceship Commander",
        "Sea Pirate",
        "Shogun",
        "Music Conductor",
        "Fullstack Developer",
        "Mecha Pilot",
        "Tester",
        "Galatic Defender",
        "Engineer",
      ];
      const locationList = [
        "Earth, Asia, Vietnam",
        "Venus, Neith, 3022",
        "Mars, Phobos, 3021",
        "Mars, Deimos, 3022",
        "Jupiter, Ganymede, 3021",
        "Jupiter, Europa, 3022",
        "Jupiter, Io, 3023",
        "Saturn, Enceladus, 3021",
        "Saturn, Titan, 3022",
        "Pluto, Charon, 3021",
      ];
      const randomNumber = random(1, 200);
      const randomAge = random(1, 120);
      const randomWeight = random(40, 120);
      const randomHeight = random(120, 220);
      const randomBloodType = bloodType[random(0, bloodType.length - 1)].name;
      const randomName = nameList[random(0, nameList.length - 1)];
      const randomJob = jobList[random(0, jobList.length - 1)];
      const randomLocation = locationList[random(0, locationList.length - 1)];
      const randomGender = genderList[random(0, genderList.length - 1)];

      const userList = await User.find();
      let index = userList.length + 1;
      let randomUserName = `user#${index}`;
      let check = await User.findOne({ userName: randomUserName });

      while (check !== null) {
        index = index + 1;
        console.log(index);
        randomUserName = `user#${index}`;
        check = await User.findOne({ userName: randomUserName });
      }

      const newCustomer = new Customer({
        userName: randomUserName,
        fullName: `${randomName} Clone #${randomNumber}`,
        age: randomAge,
        gender: randomGender,
        occupation: randomJob,
        address: randomLocation,
        bloodType: randomBloodType,
        height: randomHeight,
        weight: randomWeight,
      });
      await newCustomer.save();
      const newUser = new User({
        userName: randomUserName,
        passWord: randomUserName,
        role: "Customer",
      });
      newUser.passWord = await cryptMessage(randomUserName);
      await newUser.save();
      const randomRoom = await Room.findOne({ vacancyStatus: "AVAILABLE" });
      await Customer.findOneAndUpdate(
        {
          userName: randomUserName,
        },
        {
          assignedRoom: randomRoom.number,
        },
        { new: true }
      );
      const updatedRoom = await Room.findOneAndUpdate(
        {
          number: randomRoom.number,
        },
        {
          $push: { customerID: newCustomer },
        },
        { new: true }
      );
      if (randomRoom.customerID.length === randomRoom.totalSlot - 1) {
        await Room.findOneAndUpdate(
          {
            number: randomRoom.number,
          },
          {
            vacancyStatus: "FULL",
          },
          { new: true }
        );
      }
      console.log(
        `User ${randomUserName} assigned to room: ${updatedRoom.number}`
      );
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
