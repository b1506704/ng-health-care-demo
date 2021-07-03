import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
  userName: { type: String, require: true, maxlength: 8, unique: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  department: { type: String },
  description: { type: String },
  address: { type: String },
});

var Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
