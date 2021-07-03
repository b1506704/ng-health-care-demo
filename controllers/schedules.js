import express from "express";

import Schedule from "../models/schedule.js";

const router = express.Router();

export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();

    res.status(200).json(schedules);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: id });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  const { doctorID, startDate, endDate } = req.body;

  const newSchedule = new Schedule({ doctorID, startDate, endDate });

  try {
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { doctorID, startDate, endDate } = req.body;
  try {
    const schedule = await Schedule.findOne({ _id: id });
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: schedule.id },
      { doctorID, startDate, endDate },
      { new: true }
    );
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
