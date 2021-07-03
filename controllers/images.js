import express from "express";

import Image from "../models/image.js";

const router = express.Router();

export const getImages = async (req, res) => {
  try {
    const images = await Image.find();

    res.status(200).json(images);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findOneAndDelete({ _id: id });
    res.status(200).json(image);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createImage = async (req, res) => {
  const { sourceID, url } = req.body;

  const newImage = new Image({ sourceID, url });

  try {
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateImage = async (req, res) => {
  const { id } = req.params;
  const { sourceID, url } = req.body;
  try {
    const image = await Image.findOne({ _id: id });
    const updatedImage = await Image.findOneAndUpdate(
      { _id: image.id },
      { sourceID, url },
      { new: true }
    );
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
