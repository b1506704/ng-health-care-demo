import express from "express";

import {
  getDoctors,
  createDoctor,
  deleteDoctor,
  updateDoctor,
  generateRandomDoctor,
  deleteSelectedDoctors,
  deleteAllDoctors,
  getDoctor,
  filterDoctorByPrice,
  filterDoctorByCategory,
  searchDoctorByName,
  sortByName,
  sortByNumber,
  fetchAll,
  filterDoctorByRole,
  filterDoctorByAge,
  filterDoctorByGender,
  getDoctorByUserName
} from "../controllers/doctors.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/:_id", getDoctor);
router.post("/byUserName", getDoctorByUserName);
router.post("/randomDoctor", generateRandomDoctor);
router.post("/deleteAll", deleteAllDoctors);
router.post("/", createDoctor);
router.delete("/:_id", deleteDoctor);
router.post("/batch", deleteSelectedDoctors);
router.post("/updateDoctor/:_id", updateDoctor);
router.post("/filterByPrice", filterDoctorByPrice);
router.post("/filterByCategory", filterDoctorByCategory);
router.post("/filterByRole", filterDoctorByRole);
router.post("/filterByAge", filterDoctorByAge);
router.post("/filterByGender", filterDoctorByGender);
router.post("/searchByName", searchDoctorByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
