import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const scheduleSchema = mongoose.Schema(
  {
    doctorID: { type: String, require: true },
    doctorName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    room: { type: Number },
  },
  { timestamps: true }
);
scheduleSchema.plugin(mongoosePaginate);
var Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
