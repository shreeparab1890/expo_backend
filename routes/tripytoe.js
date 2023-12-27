const express = require("express");
const router = express.Router();

const { testAPI, getItinerary } = require("../controllers/tripytoe");

//@desc Test Triptoe API
//@route GET /api/v1/tripytoe
router.get("/", testAPI);

//@desc Get Itinerary
//@route POST /api/v1/tripytoe
router.post("/get/itinerary", getItinerary);

module.exports = router;
