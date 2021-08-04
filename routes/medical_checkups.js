import express from "express";

import {
  getPendingMedicalCheckups,
  getCompleteMedicalCheckups,
  createMedicalCheckup,
  deleteMedicalCheckup,
  updateMedicalCheckup,
  deleteSelectedMedicalCheckups,
  deleteAllMedicalCheckups,
  filterMedicalCheckupByCategory,
  searchPendingMedicalCheckupByName,
  searchCompleteMedicalCheckupByName,
  sortByName,
  sortByNumber,
  fetchAll,
  getMedicalCheckupByCustomerID,
  getPendingMedicalCheckupsByCustomerID,
  getCompleteMedicalCheckupsByCustomerID,
  searchPendingMedicalCheckupByNameAndCustomerID,
  searchCompleteMedicalCheckupByNameAndCustomerID,
} from "../controllers/medical_checkups.js";

const router = express.Router();

router.get("/pending", getPendingMedicalCheckups);
router.get("/pendingByCustomerID", getPendingMedicalCheckupsByCustomerID);
router.get("/complete", getCompleteMedicalCheckups);
router.get("/completeByCustomerID", getCompleteMedicalCheckupsByCustomerID);
router.post("/byCustomerID", getMedicalCheckupByCustomerID);
router.post("/deleteAll", deleteAllMedicalCheckups);
router.post("/", createMedicalCheckup);
router.delete("/:_id", deleteMedicalCheckup);
router.post("/batch", deleteSelectedMedicalCheckups);
router.post("/updateMedicalCheckup/:_id", updateMedicalCheckup);
router.post("/filterByCategory", filterMedicalCheckupByCategory);
router.post("/pending/searchByName", searchPendingMedicalCheckupByName);
router.post("/pending/searchByNameAndCustomerID", searchPendingMedicalCheckupByNameAndCustomerID);
router.post("/complete/searchByName", searchCompleteMedicalCheckupByName);
router.post("/complete/searchByNameAndCustomerID", searchCompleteMedicalCheckupByNameAndCustomerID);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
