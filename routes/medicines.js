import express from "express";

import {
  getMedicines,
  createMedicine,
  deleteMedicine,
  updateMedicine,
  generateRandomMedicine,
  deleteSelectedMedicines,
  deleteAllMedicines,
  getMedicine,
  filterMedicineByPrice,
  filterMedicineByCategory,
  searchMedicineByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/medicines.js";

const router = express.Router();

router.get("/", getMedicines);
router.get("/:_id", getMedicine);
router.post("/randomMedicine", generateRandomMedicine);
router.post("/deleteAll", deleteAllMedicines);
router.post("/", createMedicine);
router.delete("/:_id", deleteMedicine);
router.post("/batch", deleteSelectedMedicines);
router.post("/updateMedicine/:_id", updateMedicine);
router.post("/filterByPrice", filterMedicineByPrice);
router.post("/filterByCategory", filterMedicineByCategory);
router.post("/searchByName", searchMedicineByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
