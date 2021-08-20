import express from "express";

import {
  deleteContainer,
  deleteContainers,
  deleteFile,
  deleteFiles,
  getContainerByName,
  getContainers,
  getFileBySourceID,
  getFiles,
  getSelectedFiles,
  updateContainer,
  updateFile,
  uploadContainer,
  uploadFile,
  uploadFiles,
} from "../controllers/file.js";

const router = express.Router();
// file controller
router.get("/", getFiles);
router.post("/fetchBatch", getSelectedFiles);
router.post("/bySourceID", getFileBySourceID);
router.post("/upload", uploadFile);
router.post("/delete", deleteFile);
router.post("/update", updateFile);
router.post("/batch/delete", deleteFiles);
router.post("/batch/upload", uploadFiles);
// container controller
router.get("/getContainers", getContainers);
router.post("/getContainerByName", getContainerByName);
router.post("/deleteContainer", deleteContainer);
router.post("/uploadContainer", uploadContainer);
router.post("/updateContainer", updateContainer);
router.post("/batch/deleteContainers", deleteContainers);

export default router;
