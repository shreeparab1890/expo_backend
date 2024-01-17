const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  verifyWhatsappNumber,
  getCodebyCountry,
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

module.exports = router;
