import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const imageSchema = mongoose.Schema(
  {
    sourceID: { type: String },
    category: { type: String },
    title: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    fileType: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);
imageSchema.plugin(mongoosePaginate);
var Image = mongoose.model("Image", imageSchema);

export default Image;
