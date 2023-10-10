const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
