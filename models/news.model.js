const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema, "news");
module.exports = News;
