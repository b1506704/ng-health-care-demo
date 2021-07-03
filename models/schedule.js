import mongoose from "mongoose";

const scheduleSchema = mongoose.Schema({
  doctorID: { type: String, require: true },
  startDate: { type: String },
  endDate: { type: String },
});

var Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
