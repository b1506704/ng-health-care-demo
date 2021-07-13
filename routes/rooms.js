import express from "express";

import {
  getRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  generateRandomRoom,
  deleteSelectedRooms,
  deleteAllRooms,
  getRoom,
  filterRoomByPrice,
  filterRoomByCategory,
  searchRoomByName,
  sortByName,
  sortByNumber,
  fetchAll,
} from "../controllers/rooms.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:_id", getRoom);
router.post("/randomRoom", generateRandomRoom);
router.post("/deleteAll", deleteAllRooms);
router.post("/", createRoom);
router.delete("/:_id", deleteRoom);
router.post("/batch", deleteSelectedRooms);
router.post("/updateRoom/:_id", updateRoom);
router.post("/filterByPrice", filterRoomByPrice);
router.post("/filterByCategory", filterRoomByCategory);
router.post("/searchByName", searchRoomByName);
router.post("/sortByName", sortByName);
router.post("/sortByPrice", sortByNumber);
router.post("/fetchAll", fetchAll);

export default router;
