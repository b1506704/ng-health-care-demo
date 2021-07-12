import express from "express";

import {
  getBills,
  createBill,
  deleteBill,
  updateBill,
  generateRandomBill,
  deleteSelectedBills,
  deleteAllBills,
  getBill,
  filterBillByPrice,
  filterBillByCategory,
  searchBillByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/bills.js";

const router = express.Router();

router.get("/", getBills);
router.get("/:_id", getBill);
router.post("/randomBill", generateRandomBill);
router.post("/deleteAll", deleteAllBills);
router.post("/", createBill);
router.delete("/:_id", deleteBill);
router.post("/batch", deleteSelectedBills);
router.post("/updateBill/:_id", updateBill);
router.post("/filterByPrice", filterBillByPrice);
router.post("/filterByCategory", filterBillByCategory);
router.post("/searchByName", searchBillByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
