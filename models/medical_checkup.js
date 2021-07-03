import mongoose from "mongoose";

const medicalCheckupSchema = mongoose.Schema({
  doctorID: { type: String, require: true },
  customerID: { type: String, require: true },
  location: { type: String },
  startDate: { type: String },
});

var MedicalCheckup = mongoose.model("MedicalCheckup", medicalCheckupSchema);

export default MedicalCheckup;
