import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
  userName: { type: String, require: true, maxlength: 8, unique: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  occupation: { type: String },
  address: { type: String },
  bloodType: { type: String },
});

var Customer = mongoose.model("Customer", customerSchema);

export default Customer;
