import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const billSchema = mongoose.Schema(
  {
    prescriptionID: { type: String },
    customerID: { type: String },
    totalCost: { type: Number },
    healthInsurance: { type: String}
  },
  { timestamps: true }
);
billSchema.plugin(mongoosePaginate);
var Bill = mongoose.model("Bill", billSchema);

export default Bill;
