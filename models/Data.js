const mongoose = require("mongoose");
const Link = require("../models/Link.js");
const User = require("../models/User.js");

const { Schema } = mongoose;

const DataSchema = new Schema({
  company_name: {
    type: String,
  },
  website: {
    type: String,
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
  },
  tel: {
    type: String,
  },
  mobile: {
    type: String,
  },
  whatsApp: {
    type: String,
  },
  city: {
    type: String,
  },
  exhibitor_type: {
    type: String,
  },
  address: {
    type: String,
  },
  comment: {
    type: String,
  },
  comment1: {
    type: String,
  },
  user: {
    type: "ObjectId",
    ref: User,
  },
  link: [
    {
      type: "ObjectId",
      ref: Link,
    },
  ],
  createDate: {
    type: Date,
    default: Date.now,
  },
  UpdatedDate: {
    type: Date,
    default: Date.now,
  },
  update_user: {
    type: "ObjectId",
    ref: User,
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
