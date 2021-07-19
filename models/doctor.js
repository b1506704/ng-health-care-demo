import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const doctorSchema = mongoose.Schema(
  {
    userName: { type: String, require: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    department: { type: String },
    description: { type: String },
    role: { type: String },
    yearsOfExperience: { type: Number}
  },
  { timestamps: true }
);

doctorSchema.plugin(mongoosePaginate);
var Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
