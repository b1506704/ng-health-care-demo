import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: { type: String, require: true, unique: true, maxlength: 8 },
  passWord: { type: String, require: true },
  isLogin: { type: Boolean },
  role: { type: String },
});

var User = mongoose.model("User", userSchema);

export default User;
