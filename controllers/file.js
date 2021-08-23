import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import { getAccountName, getCredential } from "../config/azure.config.js";
import getPagination from "../middleware/getPagination.js";

const router = express.Router();

const blobServiceClient = new BlobServiceClient(
  `https://${getAccountName()}.blob.core.windows.net`,
  getCredential()
);

export const getFiles = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const getSelectedFiles = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const getFileBySourceID = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const getFileByContainer = async (req, res) => {
  const { directory, pageSize } = req.body;
  console.log(req.body);
  try {
    const containerName = `${directory.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const imageUrlList = [];
    let i = 1;
    for await (const response of containerClient
      .listBlobsFlat()
      .byPage({ maxPageSize: pageSize })) {
      for (const blob of response.segment.blobItems) {
        const blobUrl = containerClient.getBlockBlobClient(blob.name).url;
        const imageData = {
          url: blobUrl,
          name: blob?.name,
          properties: blob?.properties,
          metadata: blob?.metadata,
        };
        imageUrlList.push(imageData);
        console.log(`Blob ${i++}: ${blob.name}`);
        console.log(`Url: ${i++}: ${blobUrl}`);
      }
    }
    res.status(200).json({
      totalItems: imageUrlList.length,
      items: imageUrlList,
      currentPage: "",
      nextPage: "",
      prevPage: "",
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const uploadFile = async (req, res) => {
  const { fileName, fileContent, fileType, fileSize, fileDirectory, metadata } =
    req.body;
  console.log(`FILE: ${fileName}. DIRECTORY: ${fileDirectory}`);
  try {
    const containerName = `${fileDirectory.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const content = fileContent;
    const blobName = `${fileDirectory}/${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    let progress;
    // NOT WORKING
    // const uploadBlobResponse = await blockBlobClient.uploadFile(content);
    // const uploadBlobResponse = await blockBlobClient.uploadData(content, {
    //   blobHTTPHeaders: { blobContentType: fileType },
    //   metadata: metadata,
    //   // onProgress: progress,
    // });
    const uploadBlobResponse = await blockBlobClient.upload(content, fileSize, {
      blobHTTPHeaders: { blobContentType: fileType },
      metadata: metadata,
      // onProgress: progress,
    });
    console.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    );
    res.status(200).json({
      message: `File ${fileName} created in ${fileDirectory}`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const uploadFiles = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const deleteFile = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const deleteFiles = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const updateFile = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

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

export const getContainerByName = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const deleteContainer = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const deleteContainers = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const uploadContainer = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    // const containerName = `${parentDir.trim().toLowerCase()}/${name
    //   .trim()
    //   .toLowerCase()}`;
    const containerName = `${name.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(containerClient);
    const createContainerResponse = await containerClient.createIfNotExists();
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

export const updateContainer = async (req, res) => {
  const { name, parentDir } = req.body;
  console.log(req.body);
  try {
    res.status(200).json({
      message: `Folder ${name} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export default router;
