import express from "express";

import {
  getPrescriptions,
  getPrescriptionByCustomerID,
  createPrescription,
  deletePrescription,
  updatePrescription,
  deleteSelectedPrescriptions,
  deleteAllPrescriptions,
  getPrescription,
  filterPrescriptionByCategory,
  searchPrescriptionByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/prescriptions.js";

const router = express.Router();

router.get("/", getPrescriptions);
router.get("/:_id", getPrescription);
router.post("/byCustomerID", getPrescriptionByCustomerID);
router.post("/deleteAll", deleteAllPrescriptions);
router.post("/", createPrescription);
router.delete("/:_id", deletePrescription);
router.post("/batch", deleteSelectedPrescriptions);
router.post("/updatePrescription/:_id", updatePrescription);
router.post("/filterByCategory", filterPrescriptionByCategory);
router.post("/searchByName", searchPrescriptionByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
