const mongoose = require("mongoose");
const Events = require("../models/Events.js");
const User = require("../models/User.js");
const Consultant = require("../models/Consultant.js");

const { Schema } = mongoose;

const InquiryDataSchema = new Schema({
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
  inquired_event_name: [
    {
      type: "ObjectId",
      ref: Events,
    },
  ],
  consultant_name: {
    type: "ObjectId",
    ref: Consultant,
  },

  inquiry_type: {
    type: String,
    required: true,
  },
  inq_for: {
    type: String,
  },
  exhi_for: {
    type: String,
  },
  inquiry_source: {
    type: String,
    required: true,
  },
  inquiry_date: {
    type: Date,
    required: true,
  },
  exhibitor_date: {
    type: Date,
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
  whatsapp: {
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
  updateDate: {
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
