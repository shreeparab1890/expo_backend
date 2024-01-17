const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  verifyWhatsappNumber,
  getCodebyCountry,
  getYears,
  getMonths,
  getCountries,
  getCountContinent,
} = require("../controllers/extra_api.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc verify whatsapp number
//@route POST /api/v1/data/verify/whatsapp
//@access Private: Login Required
router.post("/verify/whatsapp", validateToken, verifyWhatsappNumber);

//@desc verify whatsapp number
//@route GET /api/v1/extra/get/code/bycountry
//@access Private: Login Required
router.get("/get/code/bycountry/:country", validateToken, getCodebyCountry);

//@desc get years
//@route GET /api/v1/extra/get/years
//@access Private: Login Required
router.get("/get/years", validateToken, getYears);

//@desc get months
//@route GET /api/v1/extra/get/months
//@access Private: Login Required
router.get("/get/months", validateToken, getMonths);

//@desc get countries
//@route GET /api/v1/extra/get/countries
//@access Private: Login Required
router.get("/get/countries", validateToken, getCountries);

//@desc get countries and continent
//@route GET /api/v1/extra/get/count/continent
//@access Private: Login Required
router.get("/get/count/continent", validateToken, getCountContinent);

module.exports = router;
