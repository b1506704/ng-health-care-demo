import express from "express";

import {
  getSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  generateRandomSchedule,
  deleteSelectedSchedules,
  deleteAllSchedules,
  getSchedule,
  filterScheduleByPrice,
  filterScheduleByCategory,
  searchScheduleByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/schedules.js";

const router = express.Router();

router.get("/", getSchedules);
router.get("/:_id", getSchedule);
router.post("/randomSchedule", generateRandomSchedule);
router.post("/deleteAll", deleteAllSchedules);
router.post("/", createSchedule);
router.delete("/:_id", deleteSchedule);
router.post("/batch", deleteSelectedSchedules);
router.post("/updateSchedule/:_id", updateSchedule);
router.post("/filterByPrice", filterScheduleByPrice);
router.post("/filterByCategory", filterScheduleByCategory);
router.post("/searchByName", searchScheduleByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
