import mongoose from "mongoose";

const diseaseSchema = mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String },
});

var Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
