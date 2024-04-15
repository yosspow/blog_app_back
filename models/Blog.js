const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedby: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const post = mongoose.model("Blog", schema);

module.exports = post;
