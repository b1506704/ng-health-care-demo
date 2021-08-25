import express from "express";
import Image from "../models/image.js";
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
    if (containerClient) {
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
    }
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

const createImage = async (metadata, newUrl) => {
  const { sourceID, title, category, container, fileName, fileSize, fileType } =
    metadata;
  const foundImage = await Image.findOne({ sourceID: sourceID });
  if (foundImage) {
    await Image.findOneAndUpdate(
      { sourceID: sourceID },
      {
        url: newUrl,
        title: title,
        category: category,
        container: container,
        fileName: fileName,
        fileSize: fileSize,
        fileType: fileType,
      },
      { new: true }
    );
  } else {
    const newImage = new Image({
      sourceID,
      url: newUrl,
      title,
      category,
      container,
      fileName,
      fileSize,
      fileType,
    });
    await newImage.save();
  }
  console.log(metadata);
  console.log(newUrl);
};

export const uploadFile = async (req, res) => {
  const { fileName, fileContent, fileType, fileDirectory, metadata } = req.body;
  console.log(`FILE: ${fileName}. DIRECTORY: ${fileDirectory}`);
  try {
    const containerName = `${fileDirectory.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const imgBuffer = new Buffer.from(fileContent, "base64");
    const content = imgBuffer;
    const blobName = `${fileDirectory}/${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    let progress;
    const uploadBlobResponse = await blockBlobClient.uploadData(content, {
      blobHTTPHeaders: { blobContentType: fileType },
      // onProgress: progress,
    });
    const imgUrl = blockBlobClient.url;
    createImage(metadata, imgUrl);
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
  const { name, container } = req.body;
  console.log(req.body);

  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    const deleteBlolbResponse = await containerClient.deleteBlob(name);
    await Image.findOneAndDelete({
      title: name.split("/")[1],
    });
    console.log(`Blolb ${name} deleted `, deleteBlolbResponse.requestId);
    res.status(200).json({
      message: `Blob ${name} in ${container} deleted`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const deleteFiles = async (req, res) => {
  const { selectedItems, container } = req.body;
  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    for (let i = 0; i < selectedItems.length; i++) {
      const deleteBlolbResponse = await containerClient.deleteBlob(
        selectedItems[i]
      );
      console.log(
        `Blolb ${selectedItems[i]} deleted `,
        deleteBlolbResponse.requestId
      );
      await Image.findOneAndDelete({
        title: selectedItems[i].split("/")[1],
      });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} image deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
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
  const { name } = req.query;
  console.log(name);
  try {
    const containerClient = blobServiceClient.getContainerClient(name);
    const deleteContainerResponse = containerClient.deleteIfExists();
    await Image.deleteMany({
      container: name,
    });
    console.log(
      `Container ${name} deleted. `,
      deleteContainerResponse.requestId
    );
    res.status(200).json({
      message: `Folder ${name} deleted`,
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
