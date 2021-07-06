import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/auth.config.js";

export default function getToken(obj, subject) {
  return jwt.sign(obj, jwtSecretKey, {
    expiresIn: 120,
    subject: subject,
  });
}
