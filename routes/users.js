import express from "express";

import {
  login,
  register,
  logout,
  getUsers,
  //   getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";

const router = express.Router();

router.post("/", register);
// router.get('/:userName', getUser);
router.get("/", getUsers);
router.post("/:userInfo", login);
router.post("/logout/:userInfo", logout);
router.delete("/:userName", deleteUser);
router.post("/updateUser/:userName", updateUser);

export default router;
