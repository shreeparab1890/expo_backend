const mongoose = require("mongoose");
//const Link = require("../models/Link.js");
const User = require("../models/User.js");

const { Schema } = mongoose;

const InquiryDataSchema = new Schema({
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
  inquired_event_name: {
    type: String,
    required: true,
  },
  consultant_name: {
    type: String,
    required: true,
  },
  inquiry_type: {
    type: String,
    required: true,
  },
  inquiry_source: {
    type: String,
    required: true,
  },
  inquiry_date: {
    type: String,
    required: true,
  },
  exhibitor_date: {
    type: String,
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

module.exports = mongoose.model("InquiryData", InquiryDataSchema);
