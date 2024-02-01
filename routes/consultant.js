const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testEventsAPI,
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEvent,
  approveEvent,
  disapproveEvent,
} = require("../controllers/consultant.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Consultant API
//@route GET /api/v1/consultant
//@access Private: Role Admin
router.get("/", validateToken, testEventsAPI);

//@desc Create New Consultant
//@route POST /api/v1/consultant/add
//@access Private: Admin
router.post(
  "/add",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  createEvent
);

//@desc Update consultant with id
//@route PUT /api/v1/consultant/update/:id
//@access Private: Admin
router.put(
  "/update/:id",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  updateEvent
);

//@desc Delete consultant with id (we are updating active to false )
//@route PUT /api/v1/consultant/delete/:id
//@access private: Role Admin
router.put("/delete/:id", validateToken, deleteEvent);

//@desc Get all consultant
//@route GET /api/v1/consultant/getall
//@access private: Role Admin
router.get("/getall", validateToken, getEvents);

//@desc Get consultant by id
//@route GET /api/v1/consultant/get/:id
//@access private: Role Admin
router.get("/get/:id", validateToken, getEvent);

//@desc approve cosultant with id (we are updating approve to true )
//@route PUT /api/v1/consultant/approve/:id
//@access private: Role Admin
router.put("/approve/:id", validateToken, approveEvent);

//@desc dis approve cosultant with id (we are updating approve to true )
//@route PUT /api/v1/consultant/disapprove/:id
//@access private: Role Admin
router.put("/disapprove/:id", validateToken, disapproveEvent);

module.exports = router;
