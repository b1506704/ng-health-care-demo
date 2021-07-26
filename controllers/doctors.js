import express from "express";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import cryptMessage from "../middleware/cryptMessage.js";
import getPagination from "../middleware/getPagination.js";
import random from "../middleware/RandomNumber.js";
import departmentList from "../middleware/mock-department.js";
const router = express.Router();

export const getDoctors = (req, res) => {
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
    Doctor.paginate({}, options)
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
    const doctor = await Doctor.find();
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getDoctor = async (req, res) => {
  const { _id } = req.params;
  try {
    const doctor = await Doctor.findOne({ _id: _id });
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const getDoctorByUserName = async (req, res) => {
  const { userName } = req.query;
  try {
    const doctor = await Doctor.findOne({ userName: userName });
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedDoctors = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const doctor = await Doctor.findOneAndDelete({ _id: selectedItems[i] });
      await User.findOneAndDelete({ userName: doctor.userName });
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} doctor deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Doctor not found!" });
  }
};

export const deleteDoctor = async (req, res) => {
  const { _id } = req.params;
  try {
    const doctor = await Doctor.findOneAndDelete({ _id: _id });
    await User.findOneAndDelete({ userName: doctor.userName });
    res.status(200).json({ message: `1 Doctor deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Doctor not found!" });
  }
};

export const deleteAllDoctors = async (req, res) => {
  try {
    await Doctor.deleteMany({});
    await User.deleteMany({ role: "Doctor" });
    res.status(200).json({ message: "All doctors deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const createDoctor = async (req, res) => {
  const {
    fullName,
    age,
    gender,
    department,
    role,
    description,
    yearsOfExperience,
  } = req.body;
  console.log(req.body);

  try {
    const userList = await User.find();
    let index = userList.length + 1;
    let randomUserName = `user#${index}`;
    let check = await User.findOne({ userName: randomUserName });

    while (check !== null) {
      index = index + 1;
      console.log(index);
      randomUserName = `user#${index}`;
      check = await User.findOne({ userName: randomUserName });
    }

    const newDoctor = new Doctor({
      userName: randomUserName,
      fullName,
      age,
      gender,
      department,
      role,
      description,
      yearsOfExperience,
    });
    await newDoctor.save();
    const newUser = new User({
      userName: randomUserName,
      passWord: randomUserName,
      role: "Doctor",
    });
    newUser.passWord = await cryptMessage(randomUserName);
    await newUser.save();
    res.status(200).json({ message: `Doctor ${fullName} created` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create doctor!" });
  }
};

export const filterDoctorByPrice = (req, res) => {
  const { criteria, value, page, size } = req.query;
  console.log(
    `Page: ${page}  Size: ${size}. Criteria: ${criteria} Value: ${value}`
  );
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    let query = {};
    switch (criteria) {
      case "=":
        query = {
          age: value,
        };
        break;
      case "<":
        query = {
          age: { $lt: value },
        };
        break;
      case ">":
        query = {
          age: { $gt: value },
        };
        break;
      case ">=":
        query = {
          age: { $gte: value },
        };
        break;
      case "<=":
        query = {
          age: { $lte: value },
        };
        break;
      case "!=":
        query = {
          age: { $ne: value },
        };
        break;
      default:
        break;
    }
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const filterDoctorByCategory = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { department: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const filterDoctorByRole = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { role: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const filterDoctorByGender = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { gender: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const filterDoctorByAge = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = { age: value };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const searchDoctorByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      fullName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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
      sort: { role: value },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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
      sort: { age: value },
      offset: offset,
      limit: limit,
    };
    Doctor.paginate(query, options)
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

export const generateRandomDoctor = async (req, res) => {
  try {
    for (let i = 0; i < 10; i++) {
      const genderList = ["Male", "Female"];
      const roleList = [
        { name: "Doctor" },
        { name: "Nurses" },
        { name: "Assistants" },
      ];
      const department = departmentList();
      const nameList = [
        "Dr. Strange",
        "Dr. Alpha",
        "Dr. Beta",
        "Dr. Alien",
        "Dr. Predator",
      ];
      const randomNumber = random(1, 200);
      const randomAge = random(20, 70);
      const randomExperience = random(20, 50);
      const randomDepartment =
        department[random(0, department.length - 1)].name;
      const randomRole = roleList[random(0, roleList.length - 1)].name;
      const randomName = nameList[random(0, nameList.length - 1)];
      const randomGender = genderList[random(0, genderList.length - 1)];
      const userList = await User.find();
      let index = userList.length + 1;
      let randomUserName = `user#${index}`;
      let check = await User.findOne({ userName: randomUserName });

      while (check !== null) {
        index = index + 1;
        console.log(index);
        randomUserName = `user#${index}`;
        check = await User.findOne({ userName: randomUserName });
      }
      const newDoctor = new Doctor({
        userName: randomUserName,
        fullName: `${randomName} Clone #${randomNumber}`,
        age: randomAge,
        gender: randomGender,
        department: randomDepartment,
        description: `Specialize in #${randomNumber} treatment`,
        role: randomRole,
        yearsOfExperience: randomExperience,
      });
      await newDoctor.save();
      const newUser = new User({
        userName: randomUserName,
        passWord: randomUserName,
        role: "Doctor",
      });
      newUser.passWord = await cryptMessage(randomUserName);
      await newUser.save();
      console.log(`Doctor ${newDoctor.userName} created!`);
    }
    res.status(200).json({ message: `Doctors created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create doctor!" });
  }
};

export const updateDoctor = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const doctor = await Doctor.findOne({ _id: _id });
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { _id: doctor._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 doctor updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export default router;
