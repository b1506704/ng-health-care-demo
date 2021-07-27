import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const medicalCheckupSchema = mongoose.Schema(
  {
    doctorID: { type: String, require: true },
    customerID: { type: String, require: true },
    prescriptionID: { type: String },
    priority: { type: Number },
    healthEnsurance: { type: String },
    // doctor's office
    location: { type: String },
    purpose: { type: String },
    status: { type: String, default: "Pending" },
    startDate: { type: String },
  },
  { timestamps: true }
);
medicalCheckupSchema.plugin(mongoosePaginate);
var MedicalCheckup = mongoose.model("MedicalCheckup", medicalCheckupSchema);

export default MedicalCheckup;
