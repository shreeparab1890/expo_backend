const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  UpdatedDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Events", EventsSchema);
