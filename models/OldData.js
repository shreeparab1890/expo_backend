const mongoose = require("mongoose");
const Link = require("../models/Link.js");
const User = require("../models/User.js");

const { Schema } = mongoose;

const OldDataSchema = new Schema({
  company_name: {
    type: String,
  },
  website: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
  },
  product: {
    type: String,
  },
  source: {
    type: String,
  },
  contact: {
    type: String,
  },
  designation: {
    type: String,
  },
  tel: {
    type: String,
  },
  mobile: {
    type: String,
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  status: {
    type: String,
  },
  address: {
    type: String,
  },
  comment: {
    type: String,
  },
  feedDate: {
    type: String,
  },
  lastupdateddate: {
    type: String,
  },
});

module.exports = mongoose.model("OldData", OldDataSchema);
