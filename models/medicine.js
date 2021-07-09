import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const medicineSchema = mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    brand: { type: String },
    effect: { type: String },
  },
  { timestamps: true }
);
medicineSchema.plugin(mongoosePaginate);

var Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
