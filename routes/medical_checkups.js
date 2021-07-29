import express from "express";

import {
  getPendingMedicalCheckups,
  getCompleteMedicalCheckups,
  createMedicalCheckup,
  deleteMedicalCheckup,
  updateMedicalCheckup,
  deleteSelectedMedicalCheckups,
  deleteAllMedicalCheckups,
  // getMedicalCheckup,
  filterMedicalCheckupByCategory,
  searchPendingMedicalCheckupByName,
  searchCompleteMedicalCheckupByName,
  sortByName,
  sortByNumber,
  fetchAll,
  getMedicalCheckupByCustomerID,
} from "../controllers/medical_checkups.js";

const router = express.Router();

router.get("/pending", getPendingMedicalCheckups);
router.get("/complete", getCompleteMedicalCheckups);
// router.get("/:_id", getMedicalCheckup);
router.post("/byCustomerID", getMedicalCheckupByCustomerID);
router.post("/deleteAll", deleteAllMedicalCheckups);
router.post("/", createMedicalCheckup);
router.delete("/:_id", deleteMedicalCheckup);
router.post("/batch", deleteSelectedMedicalCheckups);
router.post("/updateMedicalCheckup/:_id", updateMedicalCheckup);
router.post("/filterByCategory", filterMedicalCheckupByCategory);
router.post("/pending/searchByName", searchPendingMedicalCheckupByName);
router.post("/complete/searchByName", searchCompleteMedicalCheckupByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
