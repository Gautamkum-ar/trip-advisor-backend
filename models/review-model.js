import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "destinations",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("review", reviewSchema);
