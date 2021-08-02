import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const prescriptionSchema = mongoose.Schema(
  {
    medicalCheckupID: { type: String},
    customerID: { type: String },
    customerName: { type: String },
    doctorID: { type: String },
    doctorName: { type: String },
    diseaseList: { type: Array },
    medicineList: { type: Array },
    htmlMarkUp: { type: String },
    advice: { type: String },
  },
  { timestamps: true }
);
prescriptionSchema.plugin(mongoosePaginate);
var Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
