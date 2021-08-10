import express from "express";
import Image from "../models/image.js";
import getPagination from "../middleware/getPagination.js";
const router = express.Router();

export const getImages = (req, res) => {
  const { page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Image.paginate({}, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const fetchAll = async (req, res) => {
  try {
    const image = await Image.find();
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getImage = async (req, res) => {
  const { _id } = req.params;
  try {
    const image = await Image.findOne({ _id: _id });
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getImageBySourceID = async (req, res) => {
  const { sourceID } = req.query;
  try {
    const image = await Image.findOne({
      sourceID: sourceID,
    });
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedImages = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const deletedImage = await Image.findOneAndDelete({
        _id: selectedItems[i],
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

export const deleteImage = async (req, res) => {
  const { _id } = req.params;
  try {
    const image = await Image.findOneAndDelete({ _id: _id });
    res.status(200).json({ message: `1 image deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Medical checkup not found!" });
  }
};

export const deleteAllImages = async (req, res) => {
  try {
    await Image.deleteMany({});
    res.status(200).json({ message: "All images deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createImage = async (req, res) => {
  const { sourceID, url } = req.body;
  console.log(req.body);
  try {
    const newImage = new Image({
      sourceID,
      url,
    });
    await newImage.save();
    // await MedicalCheckup.findOneAndUpdate(
    //   {
    //     _id: medicalCheckupID,
    //   },
    //   {
    //     status: "complete",
    //     priority: 1,
    //     doctorID: doctorID,
    //   }
    // );
    // console.log(`Update checkup ${medicalCheckupID}`);
    res.status(200).json({
      message: `Image of ${sourceID} created`,
    });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create image!" });
  }
};

export const filterImageByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { status: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Image.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const searchImageByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      fullName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { imageID: "desc" },
      offset: offset,
      limit: limit,
    };
    Image.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const sortByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {};
    // value = desc || asc
    const options = {
      sort: { name: value },
      offset: offset,
      limit: limit,
    };
    Image.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const sortByNumber = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {};
    // value = desc || asc
    const options = {
      sort: { priority: value },
      offset: offset,
      limit: limit,
    };
    Image.paginate(query, options)
      .then((data) => {
        res.status(200).json({
          totalItems: data.totalDocs,
          items: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          nextPage: data.nextPage,
          prevPage: data.prevPage,
        });
      })
      .catch((error) => {
        res.status(404).json({ errorMessage: error.message });
      });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const updateImage = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const image = await Image.findOne({ _id: _id });
      const updatedImage = await Image.findOneAndUpdate(
        { _id: image._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 image updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
