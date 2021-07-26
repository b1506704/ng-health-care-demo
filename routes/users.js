import express from "express";

import {
  login,
  register,
  logout,
  getUsers,
  getUser,
  generateRandomUser,
  deleteAllUsers,
  deleteSelectedUsers,
  filterUserByCategory,
  searchUserByName,
  sortByName,
  sortByNumber,
  fetchAll,
  updateUser,
  deleteUser,
} from "../controllers/users.js";

const router = express.Router();
router.get("/", getUsers);
router.get("/:_id", getUser);
router.post("/randomUser", generateRandomUser);
router.post("/deleteAll", deleteAllUsers);
router.delete("/:_id", deleteUser);
router.post("/batch", deleteSelectedUsers);
router.post("/updateUser/:_id", updateUser);
router.post("/filterByCategory", filterUserByCategory);
router.post("/searchByName", searchUserByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);
router.post("/", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
