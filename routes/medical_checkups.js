import express from "express";

import {
  getMedicalCheckups,
  createMedicalCheckup,
  deleteMedicalCheckup,
  updateMedicalCheckup,
  deleteSelectedMedicalCheckups,
  deleteAllMedicalCheckups,
  getMedicalCheckup,
  filterMedicalCheckupByCategory,
  searchMedicalCheckupByName,
  sortByName,
  sortByNumber,
  fetchAll,
  getMedicalCheckupByPrescriptionID,
} from "../controllers/medical_checkups.js";

const router = express.Router();

router.get("/", getMedicalCheckups);
router.get("/:_id", getMedicalCheckup);
router.post("/byPrescriptionID", getMedicalCheckupByPrescriptionID);
router.post("/deleteAll", deleteAllMedicalCheckups);
router.post("/", createMedicalCheckup);
router.delete("/:_id", deleteMedicalCheckup);
router.post("/batch", deleteSelectedMedicalCheckups);
router.post("/updateMedicalCheckup/:_id", updateMedicalCheckup);
router.post("/filterByCategory", filterMedicalCheckupByCategory);
router.post("/searchByName", searchMedicalCheckupByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
