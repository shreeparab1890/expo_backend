const mongoose = require("mongoose");
const Department = require("../models/Department.js");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  whatsapp_no: {
    type: Number,
    required: true,
  },
  joining_date: {
    type: String,
    default: "20-09-2023",
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: "ObjectId",
    ref: Department,
  },
  roleType: {
    type: String,
    default: "data_entry_operator",
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

module.exports = mongoose.model("User", UserSchema);
