const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewschema = new Schema({
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdate: {
    type: Date,
    default: Date.now
  },
    author:{
      type: mongoose.Schema.Types.ObjectId,
        ref:"User",
      }
});

module.exports = mongoose.model("review", reviewschema);
