const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testUserAPI,
  uploadOldData,
  getFilterData,
  getAllData,
} = require("../controllers/oldData.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
router.get("/", validateToken, testUserAPI);

router.get("/upload", validateToken, uploadOldData);

router.post("/filter", validateToken, getFilterData);

router.get("/getall", validateToken, getAllData);

module.exports = router;
