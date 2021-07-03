import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  number: { type: String },
  vacancyStatus: { type: String, required: true, default: "vancant" },
  customerID: { type: Array },
  admissionDate: { type: String },
  dischargeDate: { type: String },
});

var Room = mongoose.model("Room", roomSchema);

export default Room;
