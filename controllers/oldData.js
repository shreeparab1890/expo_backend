const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const Data = require("../models/Data");
const User = require("../models/User.js");
const logger = require("../config/logger.js");
var axios = require("axios");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
const testUserAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/old/data | User: ${user.name} | responnded with "Data API Test Successfully" `
    );
    return res.status(200).send("Data API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  testUserAPI,
};
