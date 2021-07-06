import bcrypt from "bcryptjs";

export default async function cryptMessage(msg) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(msg, salt);
}
