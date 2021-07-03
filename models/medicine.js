import mongoose from "mongoose";

const medicineSchema = mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  brand: { type: String },
  effect: { type: String },
});

var Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
