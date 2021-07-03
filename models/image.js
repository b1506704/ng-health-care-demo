import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  sourceID: { type: String },
  url: { type: String },
});

var Image = mongoose.model("Image", imageSchema);

export default Image;
