import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

