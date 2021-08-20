import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import { getAccountName, getCredential } from "../config/azure.config.js";
import getPagination from "../middleware/getPagination.js";

const router = express.Router();

const blobServiceClient = new BlobServiceClient(
  `https://${getAccountName()}.blob.core.windows.net`,
  getCredential()
);

export const getFiles = async (req, res) => {};

export const getSelectedFiles = async (req, res) => {};

export const getFileBySourceID = async (req, res) => {};

export const uploadFile = async (req, res) => {};

export const uploadFiles = async (req, res) => {};

export const deleteFile = async (req, res) => {};

export const deleteFiles = async (req, res) => {};

export const updateFile = async (req, res) => {};

export const getContainers = async (req, res) => {
  const { page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}`);
  const { limit, offset } = getPagination(page, size);
  console.log(`Limit: ${limit}  Offset: ${offset}`);
  try {
    let containerList = [];
    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
      containerList.push(container);
      console.log(`Container ${i++}: ${container.name}`);
    }
    res.status(200).json({
      totalItems: "",
      items: containerList,
      currentPage: "",
      nextPage: "",
      prevPage: "",
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
  }
};

export const getContainerByName = async (req, res) => {};

export const deleteContainer = async (req, res) => {};

export const deleteContainers = async (req, res) => {};

export const uploadContainer = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    const containerName = `${name.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create();
    res.status(200).json({
      message: `Folder ${name} created`,
    });
    console.log(
      `Create container ${containerName} successfully`,
      createContainerResponse.requestId
    );
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const updateContainer = async (req, res) => {};

export default router;
