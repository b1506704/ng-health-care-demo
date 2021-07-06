import express from "express";
import User from "../models/user.js";
import comparePassword from "../middleware/comparePassword.js";
import cryptMessage from "../middleware/cryptMessage.js";
import getToken from "../middleware/jwt.js";

const router = express.Router();

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ errorMessage: "Failed to get data!" });
  }
};

export const deleteUser = async (req, res) => {
  const { userName } = req.params;
  try {
    await User.findOneAndDelete({ userName: userName });
    res.status(200).json({ message: `User ${userName} deleted` });
  } catch (error) {
    res.status(404).json({ errorMessage: "User not found!" });
  }
};

// export const getUser = async (req, res) => {
//   const { userName } = req.params;
//   try {
//     const user = await User.findOne({ userName: userName });
//     res.status(200).json({ message: `User ${userName} deleted` });
//   } catch (error) {
//     res.status(404).json({ errorMessage: "User not found" });
//   }
// };

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
      res.status(400).json({ errorMessage: "Username already exist!" });
    } else {
      const newUser = new User({ userName, passWord, role });
      newUser.passWord = await cryptMessage(passWord);
      await newUser.save();
      res.status(201).json({ message: "Signup successfully" });
    }
  } catch (error) {
    res.status(409).json({ errorMessage: "Error occur!" });
  }
};
export const updateUser = async (req, res) => {
  const { userName, passWord, role } = req.body;
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        { userName: user.userName },
        {
          userName,
          passWord,
          role,
        },
        { new: true }
      );
      updatedUser.passWord = await cryptMessage(passWord);
      await newUser.save();
      res.status(200).json({ message: `User ${user.userName} updated` });
    } else {
      res.status(404).json({ errorMessage: "User not found!" });
    }
  } catch (error) {
    res.status(404).json({ errorMessage: "Error occur!" });
  }
};

export default router;
