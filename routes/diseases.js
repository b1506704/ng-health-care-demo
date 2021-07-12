import express from "express";

import {
  getDiseases,
  createDisease,
  deleteDisease,
  updateDisease,
  generateRandomDisease,
  deleteSelectedDiseases,
  deleteAllDiseases,
  getDisease,
  filterDiseaseByPrice,
  filterDiseaseByCategory,
  searchDiseaseByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/diseases.js";

const router = express.Router();

router.get("/", getDiseases);
router.get("/:_id", getDisease);
router.post("/randomDisease", generateRandomDisease);
router.post("/deleteAll", deleteAllDiseases);
router.post("/", createDisease);
router.delete("/:_id", deleteDisease);
router.post("/batch", deleteSelectedDiseases);
router.post("/updateDisease/:_id", updateDisease);
router.post("/filterByPrice", filterDiseaseByPrice);
router.post("/filterByCategory", filterDiseaseByCategory);
router.post("/searchByName", searchDiseaseByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
