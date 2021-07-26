import express from "express";

import Room from "../models/room.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";
import Customer from "../models/customer.js";

const router = express.Router();

export const getRooms = (req, res) => {
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
    Room.paginate({}, options)
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
    const room = await Room.find();
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getRoom = async (req, res) => {
  const { _id } = req.params;
  try {
    const room = await Room.findOne({ _id: _id });
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedRooms = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const room = await Room.findOneAndDelete({ _id: selectedItems[i] });
      await Customer.updateMany(
        { assignedRoom: room.number },
        { $set: { assignedRoom: null } }
      );
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} room deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Room not found!" });
  }
};

export const deleteRoom = async (req, res) => {
  const { _id } = req.params;
  try {
    const room = await Room.findOneAndDelete({ _id: _id });
    await Customer.updateMany(
      { assignedRoom: room.number },
      { $set: { assignedRoom: null } }
    );
    res.status(200).json({ message: `1 Room deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Room not found!" });
  }
};

export const deleteAllRooms = async (req, res) => {
  try {
    await Room.deleteMany({});
    await Customer.updateMany({}, { $set: { assignedRoom: null } });
    res.status(200).json({ message: "All rooms deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createRoom = async (req, res) => {
  const {
    number,
    vacancyStatus,
    totalSlot,
    customerID,
    admissionDate,
    dischargeDate,
  } = req.body;
  console.log(req.body);

  try {
    const newRoom = new Room({
      number,
      vacancyStatus,
      totalSlot,
      customerID,
      admissionDate,
      dischargeDate,
    });
    await newRoom.save();
    res.status(200).json({ message: `Room ${number} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create room!" });
  }
};

export const filterRoomByPrice = (req, res) => {
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
    Room.paginate(query, options)
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

export const filterRoomByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { vacancyStatus: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Room.paginate(query, options)
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

export const searchRoomByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      number: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Room.paginate(query, options)
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
    Room.paginate(query, options)
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
      sort: { totalSlot: value },
      offset: offset,
      limit: limit,
    };
    Room.paginate(query, options)
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

export const generateRandomRoom = async (req, res) => {
  try {
    const roomList = await Room.find();
    for (let i = roomList.length; i < roomList.length + 100; i++) {
      const randomSlot = random(20, 100);
      const vacancyStatus = [{ name: "AVAILABLE" }];
      const randomVacancyStatus =
        vacancyStatus[random(0, vacancyStatus.length - 1)].name;
      const randomDate_1 = new Date(
        2020,
        random(1, 12),
        random(1, 31),
        random(1, 24),
        random(1, 60),
        random(1, 60)
      );
      const randomDate_2 = new Date();
      const newRoom = new Room({
        number: `R${i}`,
        customerID: [],
        vacancyStatus: randomVacancyStatus,
        totalSlot: randomSlot,
        admissionDate: randomDate_1,
        dischargeDate: randomDate_2,
      });
      await newRoom.save();
    }
    res.status(200).json({ message: `Rooms created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create room!" });
  }
};

export const updateRoom = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const room = await Room.findOne({ _id: _id });
      const updatedRoom = await Room.findOneAndUpdate(
        { _id: room._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 room updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
