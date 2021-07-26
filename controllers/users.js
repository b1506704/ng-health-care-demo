import express from "express";
import User from "../models/user.js";
import Customer from "../models/customer.js";
import Doctor from "../models/doctor.js";
import Room from "../models/room.js";
import random from "../middleware/RandomNumber.js";
import comparePassword from "../middleware/comparePassword.js";
import cryptMessage from "../middleware/cryptMessage.js";
import getToken from "../middleware/jwt.js";
import departmentList from "../middleware/mock-department.js";
import getPagination from "../middleware/getPagination.js";

const router = express.Router();

export const getUsers = (req, res) => {
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
    User.paginate({}, options)
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

export const getUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findOne({ _id: _id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteSelectedUsers = async (req, res) => {
  const selectedItems = req.body;
  try {
    for (let i = 0; i < selectedItems.length; i++) {
      const user = await User.findOneAndDelete({ _id: selectedItems[i] });
      switch (user.role) {
        case "Customer":
          await Customer.findOneAndDelete({ userName: user.userName });
          break;
        case "Doctor":
          await Doctor.findOneAndDelete({ userName: user.userName });
          break;
        default:
          break;
      }
      if (i === selectedItems.length - 1) {
        res.status(200).json({
          message: `${i + 1} user deleted`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "User not found!" });
  }
};

export const deleteUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: _id });
    switch (user.role) {
      case "Customer":
        await Customer.findOneAndDelete({ userName: user.userName });
        break;
      case "Doctor":
        await Doctor.findOneAndDelete({ userName: user.userName });
        break;
      default:
        break;
    }
    res.status(200).json({ message: `1 User deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "User not found!" });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Doctor.deleteMany({});
    res.status(200).json({ message: "All users deleted!" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to perform command" });
  }
};

export const login = async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await User.findOne({ userName: userName });
  if (user) {
    const validPassword = await comparePassword(passWord, user.passWord);
    if (validPassword) {
      const token = getToken(Object.assign({}, user), user.userName);
      res.status(200).json({
        message: "Login successfully",
        token: token,
      });
    } else {
      res.status(404).json({ errorMessage: "Login failed!" });
    }
  } else {
    res.status(404).json({ errorMessage: "User does not exist!" });
  }
};

export const logout = async (req, res) => {
  const { userName } = req.body;
  try {
    await User.findOneAndUpdate(
      { userName: userName },
      { isLogin: false },
      { new: true }
    );
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(404).json({ errorMessage: "Error occur!" });
  }
};

export const register = async (req, res) => {
  const { userName, passWord, role } = req.body;

  try {
    const checkUser = await User.findOne({ userName: userName });
    if (checkUser) {
      res.status(409).json({ errorMessage: "Username already exist!" });
    } else {
      const newUser = new User({ userName, passWord, role });
      newUser.passWord = await cryptMessage(passWord);
      await newUser.save();

      const randomNumber = random(1, 200);
      const customerNameList = ["Alpha", "Beta", "Gama", "Alien", "Predator"];
      const randomAge = random(20, 70);
      const doctorNameList = [
        "Dr. Strange",
        "Dr. Alpha",
        "Dr. Beta",
        "Dr. Alien",
        "Dr. Predator",
      ];
      const genderList = ["Male", "Female"];
      switch (role) {
        case "Customer":
          const bloodType = [
            { _id: "0", name: "A" },
            { _id: "1", name: "B" },
            { _id: "2", name: "O" },
          ];
          const jobList = [
            "Student",
            "Teacher",
            "Thief",
            "Space Pirate",
            "Spaceship Commander",
            "Sea Pirate",
            "Shogun",
            "Music Conductor",
            "Fullstack Developer",
            "Mecha Pilot",
            "Tester",
            "Galatic Defender",
            "Engineer",
          ];
          const locationList = [
            "Earth, Asia, Vietnam",
            "Venus, Neith, 3022",
            "Mars, Phobos, 3021",
            "Mars, Deimos, 3022",
            "Jupiter, Ganymede, 3021",
            "Jupiter, Europa, 3022",
            "Jupiter, Io, 3023",
            "Saturn, Enceladus, 3021",
            "Saturn, Titan, 3022",
            "Pluto, Charon, 3021",
          ];
          const randomWeight = random(40, 120);
          const randomHeight = random(120, 220);
          const randomBloodType =
            bloodType[random(0, bloodType.length - 1)].name;
          const randomCustomerName =
            customerNameList[random(0, customerNameList.length - 1)];
          const randomJob = jobList[random(0, jobList.length - 1)];
          const randomLocation =
            locationList[random(0, locationList.length - 1)];
          const randomGender = genderList[random(0, genderList.length - 1)];
          const newCustomer = new Customer({
            userName: userName,
            fullName: `${randomCustomerName} Clone #${randomNumber}`,
            age: randomAge,
            gender: randomGender,
            occupation: randomJob,
            address: randomLocation,
            bloodType: randomBloodType,
            height: randomHeight,
            weight: randomWeight,
          });
          await newCustomer.save();
          const randomRoom = await Room.findOne({ vacancyStatus: "AVAILABLE" });
          await Customer.findOneAndUpdate(
            {
              userName: userName,
            },
            {
              assignedRoom: randomRoom.number,
            },
            { new: true }
          );
          const updatedRoom = await Room.findOneAndUpdate(
            {
              number: randomRoom.number,
            },
            {
              $push: { customerID: newCustomer },
            },
            { new: true }
          );
          if (randomRoom.customerID.length === randomRoom.totalSlot - 1) {
            await Room.findOneAndUpdate(
              {
                number: randomRoom.number,
              },
              {
                vacancyStatus: "FULL",
              },
              { new: true }
            );
          }

          res.status(201).json({
            message: `Signup successfully. Assigned room: ${updatedRoom.number}`,
          });
          console.log(`Assigned room: ${updatedRoom.number}`);
          break;
        case "Doctor":
          const doctorRoleList = [
            { name: "Doctor" },
            { name: "Nurses" },
            { name: "Assistants" },
          ];
          const department = departmentList();
          const randomExperience = random(20, 50);
          const randomDepartment =
            department[random(0, department.length - 1)].name;
          const randomDoctorRole =
            doctorRoleList[random(0, doctorRoleList.length - 1)].name;
          const randomDoctorName =
            doctorNameList[random(0, doctorNameList.length - 1)];
          const randomDoctorGender =
            genderList[random(0, genderList.length - 1)];
          const newDoctor = new Doctor({
            userName: userName,
            fullName: `${randomDoctorName} Clone #${randomNumber}`,
            age: randomAge,
            gender: randomDoctorGender,
            department: randomDepartment,
            description: `Specialize in #${randomNumber} treatment`,
            role: randomDoctorRole,
            yearsOfExperience: randomExperience,
          });
          await newDoctor.save();
          res.status(201).json({ message: "Signup successfully" });
          break;
        default:
          res.status(201).json({ message: "Signup successfully" });
          break;
      }
    }
  } catch (error) {
    res.status(409).json({ errorMessage: "Error occur!" });
  }
};

export const filterUserByCategory = (req, res) => {
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
    User.paginate(query, options)
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
export const searchUserByName = (req, res) => {
  const { value, page, size } = req.query;
  console.log(`Page: ${page}  Size: ${size}. Value: ${value}`);
  try {
    const { limit, offset } = getPagination(page, size);
    console.log(`Limit: ${limit}  Offset: ${offset}`);
    const query = {
      userName: { $regex: value, $options: "i" },
    };
    const options = {
      sort: { createdAt: "desc" },
      offset: offset,
      limit: limit,
    };
    User.paginate(query, options)
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
      sort: { userName: value },
      offset: offset,
      limit: limit,
    };
    User.paginate(query, options)
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
    User.paginate(query, options)
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

export const generateRandomUser = async (req, res) => {
  try {
    for (let i = 0; i < 10; i++) {
      const userList = await User.find();
      const randomNumber = random(1, 200);
      const roleList = ["Customer", "Admin", "Doctor"];
      const randomRole = roleList[random(0, roleList.length - 1)];
      const customerNameList = ["Alpha", "Beta", "Gama", "Alien", "Predator"];
      const randomAge = random(20, 70);
      const doctorNameList = [
        "Dr. Strange",
        "Dr. Alpha",
        "Dr. Beta",
        "Dr. Alien",
        "Dr. Predator",
      ];
      let index = userList.length + 1;
      let randomUserName = `user#${index}`;
      let check = await User.findOne({ userName: randomUserName });

      while (check !== null) {
        index = index + 1;
        console.log(index);
        randomUserName = `user#${index}`;
        check = await User.findOne({ userName: randomUserName });
      }
      const genderList = ["Male", "Female"];
      const newUser = new User({
        userName: randomUserName,
        passWord: randomUserName,
        role: randomRole,
      });
      newUser.passWord = await cryptMessage(randomUserName);
      await newUser.save();
      switch (randomRole) {
        case "Customer":
          const bloodType = [
            { _id: "0", name: "A" },
            { _id: "1", name: "B" },
            { _id: "2", name: "O" },
          ];
          const jobList = [
            "Student",
            "Teacher",
            "Thief",
            "Space Pirate",
            "Spaceship Commander",
            "Sea Pirate",
            "Shogun",
            "Music Conductor",
            "Fullstack Developer",
            "Mecha Pilot",
            "Tester",
            "Galatic Defender",
            "Engineer",
          ];
          const locationList = [
            "Earth, Asia, Vietnam",
            "Venus, Neith, 3022",
            "Mars, Phobos, 3021",
            "Mars, Deimos, 3022",
            "Jupiter, Ganymede, 3021",
            "Jupiter, Europa, 3022",
            "Jupiter, Io, 3023",
            "Saturn, Enceladus, 3021",
            "Saturn, Titan, 3022",
            "Pluto, Charon, 3021",
          ];

          const randomWeight = random(40, 120);
          const randomHeight = random(120, 220);
          const randomBloodType =
            bloodType[random(0, bloodType.length - 1)].name;
          const randomCustomerName =
            customerNameList[random(0, customerNameList.length - 1)];
          const randomJob = jobList[random(0, jobList.length - 1)];
          const randomLocation =
            locationList[random(0, locationList.length - 1)];
          const randomGender = genderList[random(0, genderList.length - 1)];
          const newCustomer = new Customer({
            userName: randomUserName,
            fullName: `${randomCustomerName} Clone #${randomNumber}`,
            age: randomAge,
            gender: randomGender,
            occupation: randomJob,
            address: randomLocation,
            bloodType: randomBloodType,
            height: randomHeight,
            weight: randomWeight,
          });
          await newCustomer.save();
          const randomRoom = await Room.findOne({ vacancyStatus: "AVAILABLE" });
          await Customer.findOneAndUpdate(
            {
              userName: randomUserName,
            },
            {
              assignedRoom: randomRoom.number,
            },
            { new: true }
          );
          const updatedRoom = await Room.findOneAndUpdate(
            {
              number: randomRoom.number,
            },
            {
              $push: { customerID: newCustomer },
            },
            { new: true }
          );
          if (randomRoom.customerID.length === randomRoom.totalSlot - 1) {
            await Room.findOneAndUpdate(
              {
                number: randomRoom.number,
              },
              {
                vacancyStatus: "FULL",
              },
              { new: true }
            );
          }
          console.log(
            `User ${randomUserName} assigned to room: ${updatedRoom.number}`
          );
          break;
        case "Doctor":
          const doctorRoleList = [
            { name: "Doctor" },
            { name: "Nurses" },
            { name: "Assistants" },
          ];
          const department = departmentList();
          const randomExperience = random(20, 50);
          const randomDepartment =
            department[random(0, department.length - 1)].name;
          const randomDoctorRole =
            doctorRoleList[random(0, doctorRoleList.length - 1)].name;
          const randomDoctorName =
            doctorNameList[random(0, doctorNameList.length - 1)];
          const randomDoctorGender =
            genderList[random(0, genderList.length - 1)];
          const newDoctor = new Doctor({
            userName: randomUserName,
            fullName: `${randomDoctorName} Clone #${randomNumber}`,
            age: randomAge,
            gender: randomDoctorGender,
            department: randomDepartment,
            description: `Specialize in #${randomNumber} treatment`,
            role: randomDoctorRole,
            yearsOfExperience: randomExperience,
          });
          await newDoctor.save();
          break;
        default:
          break;
      }
    }
    res.status(200).json({ message: `Users created randomly` });
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to create user!" });
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.params;

  if (!req.body) {
    res.status(400).json({ errorMessage: "Updated data cannot be empty!" });
  } else {
    try {
      const user = await User.findOne({ _id: _id });
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        req.body,
        { new: true }
      );
      res.status(200).json({ message: `1 user updated` });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const fetchAll = async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: "Requested data does not exist!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export default router;
