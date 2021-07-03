import mongoose from "mongoose";

const prescriptionSchema = mongoose.Schema({
  customerID: { type: String },
  doctorID: { type: String },
  diseaseList: { type: Array },
  medicineList: { type: Array },
  advice: { type: String },
  created: { type: Number, default: Date.now() },
});

var Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
