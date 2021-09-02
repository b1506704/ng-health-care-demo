import express from "express";

import {
  cloneContainer,
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
  moveFiles,
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
router.post("/batch/move", moveFiles);
// container controller
router.get("/getContainers", getContainers);
router.post("/getContainerByName", getContainerByName);
router.post("/deleteContainer", deleteContainer);
router.post("/uploadContainer", uploadContainer);
router.post("/updateContainer", updateContainer);
router.post("/cloneContainer", cloneContainer);
router.post("/batch/deleteContainers", deleteContainers);

export default router;
