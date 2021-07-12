import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const diseaseSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    type: { type: String, require: true },
    description: { type: String },
  },
  { timestamps: true }
);
diseaseSchema.plugin(mongoosePaginate);
var Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
