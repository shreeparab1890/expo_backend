const mongoose = require("mongoose");
const User = require("../models/User.js");
const { Schema } = mongoose;

const LinkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  link_type: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  month: {
    type: String,
  },
  year: {
    type: String,
  },
  compeleted_date: {
    type: String,
  },
  mode: {
    type: String,
  },
  country: {
    type: String,
  },
  link_comment: {
    type: String,
  },
  assign_status: {
    type: String,
    required: true,
    default: "Not Assigned",
  },
  assigning_remark: {
    type: String,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  assign_user: {
    type: "ObjectId",
    ref: User,
  },
  remark: {
    type: "String",
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

module.exports = mongoose.model("Link", LinkSchema);

//Notes:
// assign_status:
// Not Assigned
// Assigned
// UnAssigned
// Accepted
// OnHold
// Completed
// Aborted
