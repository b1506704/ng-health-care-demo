import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const medicalCheckupSchema = mongoose.Schema(
  {
    doctorID: { type: String },
    customerID: { type: String },
    customerName: { type: String },
    priority: { type: Number },
    healthInsurance: { type: String },
    // doctor's office
    location: { type: String },
    purpose: { type: String },
    status: { type: String, default: "pending" },
    startDate: { type: Date },
  },
  { timestamps: true }
);
medicalCheckupSchema.plugin(mongoosePaginate);
var MedicalCheckup = mongoose.model("MedicalCheckup", medicalCheckupSchema);

export default MedicalCheckup;
