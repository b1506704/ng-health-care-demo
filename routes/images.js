import express from "express";

import {
  getImages,
  createImage,
  deleteImage,
  updateImage,
  deleteSelectedImages,
  deleteAllImages,
  getImage,
  filterImageByCategory,
  searchImageByName,
  sortByName,
  sortByNumber,
  fetchAll,
  getImageBySourceID,
  fetchSelectedImages,
} from "../controllers/images.js";

const router = express.Router();

router.get("/", getImages);
router.get("/:_id", getImage);
router.post("/bySourceID", getImageBySourceID);
router.post("/deleteAll", deleteAllImages);
router.post("/", createImage);
router.delete("/:sourceID", deleteImage);
router.post("/batch", deleteSelectedImages);
router.post("/fetchBatch", fetchSelectedImages);
router.post("/updateImage/:_id", updateImage);
router.post("/filterByCategory", filterImageByCategory);
router.post("/searchByName", searchImageByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
