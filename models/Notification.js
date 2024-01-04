const mongoose = require("mongoose");
const User = require("../models/User.js");

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
  },
  to_user: {
    type: "ObjectId",
    ref: User,
  },
  by_user: {
    type: "ObjectId",
    ref: User,
  },
  dismissed: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Notifications", NotificationSchema);
