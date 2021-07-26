import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const customerSchema = mongoose.Schema(
  {
    userName: { type: String, require: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    occupation: { type: String },
    address: { type: String },
    bloodType: { type: String },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    assignedRoom: { type: String }
  },
  { timestamps: true }
);
customerSchema.plugin(mongoosePaginate);
var Customer = mongoose.model("Customer", customerSchema);

export default Customer;
