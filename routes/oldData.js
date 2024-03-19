const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { testUserAPI } = require("../controllers/oldData.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
router.get("/", validateToken, testUserAPI);

module.exports = router;
