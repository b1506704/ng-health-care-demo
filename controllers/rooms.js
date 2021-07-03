import express from "express";

import Room from "../models/room.js";

const router = express.Router();

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findOneAndDelete({ _id: id });
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  const { number, vacancyStatus, customerID, admissionDate, dischardDate } =
    req.body;

  const newRoom = new Room({
    number,
    vacancyStatus,
    customerID,
    admissionDate,
    dischardDate,
  });

  try {
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { number, vacancyStatus, customerID, admissionDate, dischardDate } =
    req.body;
  try {
    const room = await Room.findOne({ _id: id });
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: room.id },
      { number, vacancyStatus, customerID, admissionDate, dischardDate },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
