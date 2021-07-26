import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const userSchema = mongoose.Schema(
  {
    userName: { type: String, require: true, unique: true },
    passWord: { type: String, require: true },
    isLogin: { type: Boolean },
    role: { type: String },
  },
  { timestamps: true }
);
userSchema.plugin(mongoosePaginate);
var User = mongoose.model("User", userSchema);

export default User;
