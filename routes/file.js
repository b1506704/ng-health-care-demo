import express from "express";

import {
  copyFiles,
  deleteContainer,
  deleteContainers,
  deleteFile,
  deleteFiles,
  downloadFile,
  downloadFiles,
  getContainerByName,
  getContainers,
  getFileByContainer,
  updateContainer,
  updateFile,
  uploadContainer,
  uploadFile,
  uploadFiles,
} from "../controllers/file.js";

const router = express.Router();
// file controller
router.post("/byContainer", getFileByContainer);
router.post("/upload", uploadFile);
router.post("/delete", deleteFile);
router.post("/update", updateFile);
router.post("/download", downloadFile);
router.post("/batch/download", downloadFiles);
router.post("/batch/delete", deleteFiles);
router.post("/batch/upload", uploadFiles);
router.post("/batch/copy", copyFiles);
// container controller
router.get("/getContainers", getContainers);
router.post("/getContainerByName", getContainerByName);
router.post("/deleteContainer", deleteContainer);
router.post("/uploadContainer", uploadContainer);
router.post("/updateContainer", updateContainer);
router.post("/batch/deleteContainers", deleteContainers);

export default router;
