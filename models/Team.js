const mongoose = require("mongoose");

const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Team", TeamSchema);
