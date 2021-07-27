import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const prescriptionSchema = mongoose.Schema(
  {
    prescriptionID: { type: String, unique: true },
    customerID: { type: String },
    doctorID: { type: String },
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
