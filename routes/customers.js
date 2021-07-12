import express from "express";

import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  generateRandomCustomer,
  deleteSelectedCustomers,
  deleteAllCustomers,
  getCustomer,
  filterCustomerByPrice,
  filterCustomerByCategory,
  searchCustomerByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/customers.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:_id", getCustomer);
router.post("/randomCustomer", generateRandomCustomer);
router.post("/deleteAll", deleteAllCustomers);
router.post("/", createCustomer);
router.delete("/:_id", deleteCustomer);
router.post("/batch", deleteSelectedCustomers);
router.post("/updateCustomer/:_id", updateCustomer);
router.post("/filterByPrice", filterCustomerByPrice);
router.post("/filterByCategory", filterCustomerByCategory);
router.post("/searchByName", searchCustomerByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
