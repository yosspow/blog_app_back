// Import mongoose
const mongoose = require("mongoose");

// Define Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
    },
    image: {
      type: String,
      required: true,
    },
    blogsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

// Export Category model
module.exports = Category;
