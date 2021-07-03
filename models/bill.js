import mongoose from "mongoose";

const billSchema = mongoose.Schema({
  prescriptionID: { type: String },
  customerID: { type: String },
  totalCost: { type: Number },
});

var Bill = mongoose.model("Bill", billSchema);

export default Bill;
