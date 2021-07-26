import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const roomSchema = mongoose.Schema(
  {
    number: { type: String, unique: true },
    vacancyStatus: { type: String, required: true, default: "vancant" },
    totalSlot: { type: Number },
    customerID: { type: Array },
    admissionDate: { type: Date },
    dischargeDate: { type: Date },
  },
  { timestamps: true }
);
roomSchema.plugin(mongoosePaginate);
var Room = mongoose.model("Room", roomSchema);

export default Room;
