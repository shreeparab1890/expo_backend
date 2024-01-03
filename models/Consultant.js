const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConsultantSchema = new Schema({
  name: {
    type: String,
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

module.exports = mongoose.model("Consultant", ConsultantSchema);
