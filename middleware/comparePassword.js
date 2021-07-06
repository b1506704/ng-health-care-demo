import bcrypt from "bcryptjs";

export default async function comparePassword(data, hash) {
  return await bcrypt.compare(data, hash);
}
