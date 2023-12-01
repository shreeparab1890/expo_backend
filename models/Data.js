const mongoose = require("mongoose");
const Link = require("../models/Link.js");
const User = require("../models/User.js");

const { Schema } = mongoose;

const DataSchema = new Schema({
  company_name: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  contact_person: {
    type: String,
  },
  designation: {
    type: String,
  },
  products: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
  },
  mobile: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  comment: {
    type: String,
  },
  user: {
    type: "ObjectId",
    ref: User,
  },
  link: {
    type: "ObjectId",
    ref: Link,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Data", DataSchema);
