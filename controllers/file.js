import express from "express";
import AdmZip from "adm-zip";
import Image from "../models/image.js";
import { BlobServiceClient } from "@azure/storage-blob";
import { getAccountName, getCredential } from "../config/azure.config.js";
import getPagination from "../middleware/getPagination.js";
const router = express.Router();

const blobServiceClient = new BlobServiceClient(
  `https://${getAccountName()}.blob.core.windows.net`,
  getCredential()
);

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
  if (foundImage && sourceID !== "") {
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
  const { selectedItems, container } = req.body;
  console.log(req.body);
  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    for (let i = 0; i < selectedItems.length; i++) {
      const { fileName, fileContent, fileType, fileDirectory, metadata } =
        selectedItems[i];
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
      await createImage(metadata, imgUrl);
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} files uploaded`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
  }
};

export const deleteFile = async (req, res) => {
  const { name, container } = req.body;
  console.log(req.body);

  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    const deleteBlobResponse = await containerClient.deleteBlob(name);
    await Image.findOneAndDelete({
      title: name.split("/")[1],
    });
    console.log(`Blob ${name} deleted `, deleteBlobResponse.requestId);
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
      const deleteBlobResponse = await containerClient.deleteBlob(
        selectedItems[i]
      );
      console.log(
        `Blob ${selectedItems[i]} deleted `,
        deleteBlobResponse.requestId
      );
      await Image.findOneAndDelete({
        title: selectedItems[i].split("/")[1],
      });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} files deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
  }
};

export const copyFiles = async (req, res) => {
  const { selectedItems, sourceContainer, destinationContainer } = req.body;
  try {
    const sourceContainerClient =
      blobServiceClient.getContainerClient(sourceContainer);
    const destinationContainerClient =
      blobServiceClient.getContainerClient(destinationContainer);
    if (destinationContainerClient) {
      for (let i = 0; i < selectedItems.length; i++) {
        const sourceBlobUrl = sourceContainerClient.getBlockBlobClient(
          selectedItems[i]
        ).url;
        const destinationBlob = destinationContainerClient.getBlockBlobClient(
          selectedItems[i]
        );
        const copyBlobResponse = destinationBlob.beginCopyFromURL(
          sourceBlobUrl,
          {
            onProgress(state) {
              console.log(
                `${selectedItems[i]}'s progress: ${state.copyProgress}`
              );
            },
          }
        );
        // not showing progress yet
        (await copyBlobResponse).pollUntilDone;
        const sourceImage = await Image.findOne({ url: sourceBlobUrl });
        const newImage = new Image({
          sourceID: sourceImage?.sourceID,
          url: destinationBlob.url,
          title: sourceImage?.title,
          category: sourceImage?.category,
          container: destinationContainer,
          fileName: sourceImage?.fileName,
          fileSize: sourceImage?.fileSize,
          fileType: sourceImage?.fileType,
        });
        await newImage.save();
      }
      res.status(200).json({
        message: `Copied ${selectedItems.length} items to ${destinationContainer}`,
      });
    } else {
      res.status(404).json({
        message: `Folder ${destinationContainer} not found!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
  }
};

export const moveFiles = async (req, res) => {
  const { selectedItems, sourceContainer, destinationContainer } = req.body;
  try {
    const sourceContainerClient =
      blobServiceClient.getContainerClient(sourceContainer);
    const destinationContainerClient =
      blobServiceClient.getContainerClient(destinationContainer);
    if (destinationContainerClient) {
      for (let i = 0; i < selectedItems.length; i++) {
        const sourceBlobUrl = sourceContainerClient.getBlockBlobClient(
          selectedItems[i]
        ).url;
        const destinationBlob = destinationContainerClient.getBlockBlobClient(
          selectedItems[i]
        );
        const copyBlobResponse = destinationBlob.beginCopyFromURL(
          sourceBlobUrl,
          {
            onProgress(state) {
              console.log(
                `${selectedItems[i]}'s progress: ${state.copyProgress}`
              );
            },
          }
        );
        // not showing progress yet
        (await copyBlobResponse).pollUntilDone;

        const sourceImage = await Image.findOne({ url: sourceBlobUrl });

        const newImage = new Image({
          sourceID: sourceImage?.sourceID,
          url: destinationBlob.url,
          title: sourceImage?.title,
          category: sourceImage?.category,
          container: destinationContainer,
          fileName: sourceImage?.fileName,
          fileSize: sourceImage?.fileSize,
          fileType: sourceImage?.fileType,
        });
        await newImage.save();
        const deleteBlobResponse = await sourceContainerClient.deleteBlob(
          selectedItems[i]
        );
        console.log(
          `Blob ${selectedItems[i]} deleted `,
          deleteBlobResponse.requestId
        );
      }
      res.status(200).json({
        message: `Moved ${selectedItems.length} items from ${sourceContainer}/ to ${destinationContainer}/`,
      });
    } else {
      res.status(404).json({
        message: `Folder ${destinationContainer} not found!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
  }
};

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

export const downloadFile = async (req, res) => {
  const { name, container } = req.body;
  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(name);
    const contentType = (await blockBlobClient.getProperties()).contentType;
    res.status(200).json({
      name: blockBlobClient.name,
      url: blockBlobClient.url,
      type: contentType,
    });
    console.log(`Sucessfully downloaded ${name} in ${container}`);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: "Something went wrong!" });
  }
};

export const downloadFiles = async (req, res) => {
  const { selectedItems, container } = req.body;
  console.log(req.body);
  try {
    const currentDate = new Date();
    const zip = new AdmZip();
    const containerClient = blobServiceClient.getContainerClient(container);
    let blobLists = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const blockBlobClient = containerClient.getBlockBlobClient(
        selectedItems[i]
      );
      const blobName = blockBlobClient.name;
      const blobExtension = (
        await blockBlobClient.getProperties()
      ).contentType.split("/")[1];
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      const downloadedBuffer = await streamToBuffer(
        downloadBlockBlobResponse.readableStreamBody
      );
      zip.addFile(`${blobName}.${blobExtension}`, downloadedBuffer, "Comments");
    }
    const zipFileContents = zip.toBuffer();
    const fileName = `${currentDate.toLocaleDateString()}.zip`;
    const fileType = "application/zip";
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": fileType,
      "Content-Length": zipFileContents.byteLength,
    });
    return res.end(zipFileContents);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
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
    const containerName = `${name.trim().toLowerCase()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(containerClient);
    const createContainerResponse = await containerClient.createIfNotExists({
      access: "container",
    });
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
  const { container, newContainer } = req.body;
  console.log(req.body);
  // create new container
  // copy all blobs to new container
  // update Image's container
  // delete old container
  try {
    const sourceContainerClient =
      blobServiceClient.getContainerClient(container);
    if (sourceContainerClient) {
      const destinationContainerClient = blobServiceClient.getContainerClient(
        newContainer.trim().toLowerCase()
      );
      const createContainerResponse =
        await destinationContainerClient.createIfNotExists({
          access: "container",
        });
      let i = 1;
      for await (const blob of sourceContainerClient.listBlobsFlat()) {
        const sourceBlobUrl = sourceContainerClient.getBlockBlobClient(
          blob.name
        ).url;
        const destinationBlob = destinationContainerClient.getBlockBlobClient(
          blob.name
        );
        const copyBlobResponse = destinationBlob.beginCopyFromURL(
          sourceBlobUrl,
          {
            onProgress(state) {
              console.log(`${blob.name}'s progress: ${state.copyProgress}`);
            },
          }
        );
        // not showing progress yet
        (await copyBlobResponse).pollUntilDone;
        await Image.findOneAndUpdate(
          { url: sourceBlobUrl },
          {
            url: destinationBlob.url,
            container: newContainer,
          },
          {
            new: true,
          }
        );
      }
      const deleteContainerResponse =
        await sourceContainerClient.deleteIfExists();
      res.status(200).json({
        message: `Folder ${container} changed to ${newContainer}`,
      });
    } else {
      res.status(200).json({
        message: `Folder ${container} not found!`,
      });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export const cloneContainer = async (req, res) => {
  const { container } = req.body;
  console.log(req.body);
  // create new container of name 'cloneof...'
  // copy all blobs to new container
  // update Image's container
  // delete old container
  try {
    const sourceContainerClient =
      blobServiceClient.getContainerClient(container);
    if (sourceContainerClient) {
      const newContainer = `copyof${container}`;
      const destinationContainerClient =
        blobServiceClient.getContainerClient(newContainer);
      const createContainerResponse =
        await destinationContainerClient.createIfNotExists({
          access: "container",
        });
      let i = 1;
      for await (const blob of sourceContainerClient.listBlobsFlat()) {
        const sourceBlobUrl = sourceContainerClient.getBlockBlobClient(
          blob.name
        ).url;
        const destinationBlob = destinationContainerClient.getBlockBlobClient(
          blob.name
        );
        const copyBlobResponse = await destinationBlob.beginCopyFromURL(
          sourceBlobUrl,
          {
            onProgress(state) {
              console.log(`${blob.name}'s progress: ${state.copyProgress}`);
            },
          }
        );
        // not showing progress yet
        await copyBlobResponse.pollUntilDone();
        await Image.findOneAndUpdate(
          { url: sourceBlobUrl },
          {
            url: destinationBlob.url,
            container: newContainer,
          },
          {
            new: true,
          }
        );
      }
      res.status(200).json({
        message: `Succesfully clone folder ${container}`,
      });
    } else {
      res.status(200).json({
        message: `Folder ${container} not found!`,
      });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: error.message });
    console.log(error.message);
  }
};

export default router;
