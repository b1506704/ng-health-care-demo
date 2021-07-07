import express from "express";

import {
  getMedicines,
  createMedicine,
  deleteMedicine,
  updateMedicine,
  generateRandomMedicine,
  deleteSelectedMedicines,
} from "../controllers/medicines.js";

const router = express.Router();

router.get("/", getMedicines);
router.get("/randomMedicine", generateRandomMedicine);
router.post("/", createMedicine);
router.delete("/:_id", deleteMedicine);
router.post("/batch", deleteSelectedMedicines);
router.post("/updateMedicine/:_id", updateMedicine);

export default router;
