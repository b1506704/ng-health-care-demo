import express from "express";

import Schedule from "../models/schedule.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";

const router = express.Router();

export const getSchedules = (req, res) => {
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
    Schedule.paginate({}, options)
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
    const schedule = await Schedule.find();
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getSchedule = async (req, res) => {
  const { _id } = req.params;
  try {
    const schedule = await Schedule.findOne({ _id: _id });
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedSchedules = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      await Schedule.findOneAndDelete({ _id: selectedItems[i] });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} schedule deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Schedule not found!" });
  }
};

export const deleteSchedule = async (req, res) => {
  const { _id } = req.params;
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `1 Schedule deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Schedule not found!" });
  }
};

export const deleteAllSchedules = async (req, res) => {
  try {
    await Schedule.deleteMany({});
    res.status(200).json({ message: "All schedules deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createSchedule = async (req, res) => {
  const { doctorID, doctorName, startDate, endDate, room } = req.body;
  console.log(req.body);

  try {
    const newSchedule = new Schedule({
      doctorID,
      doctorName,
      startDate,
      endDate,
      room,
    });
    await newSchedule.save();
    res.status(200).json({ message: `Schedule at ${startDate} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create schedule!" });
  }
};

export const filterScheduleByPrice = (req, res) => {
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
    Schedule.paginate(query, options)
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

export const filterScheduleByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { doctorName: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Schedule.paginate(query, options)
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

export const searchScheduleByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      doctorName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Schedule.paginate(query, options)
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
      sort: { room: value },
      offset: offset,
      limit: limit,
    };
    Schedule.paginate(query, options)
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
      sort: { room: value },
      offset: offset,
      limit: limit,
    };
    Schedule.paginate(query, options)
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

export const generateRandomSchedule = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const nameList = [
        { name: "Dr. Strange" },
        { name: "Dr. Alpha" },
        { name: "Dr. Beta" },
        { name: "Dr. Alien" },
        { name: "Dr. Predator" },
      ];
      const randomDate_1 = new Date(
        2021,
        random(1, 12),
        random(1, 31),
        random(7, 18)
      );
      const randomDate_2 = new Date(
        2021,
        randomDate_1.getMonth(),
        randomDate_1.getDate() + 6,
        randomDate_1.getHours() + 6
      );
      const randomNumber = random(1, 200);
      const randomName = nameList[random(0, nameList.length - 1)].name;
      const newSchedule = new Schedule({
        doctorID: `doctor#${randomNumber}`,
        doctorName: `${randomName} Clone`,
        startDate: randomDate_1,
        endDate: randomDate_2,
        room: `${random(1, 300)}`,
      });
      await newSchedule.save();
    }
    res.status(200).json({ message: `Schedules created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create schedule!" });
  }
};

export const updateSchedule = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const schedule = await Schedule.findOne({ _id: _id });
      const updatedSchedule = await Schedule.findOneAndUpdate(
        { _id: schedule._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 schedule updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
