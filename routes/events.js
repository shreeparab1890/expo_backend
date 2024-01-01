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
} = require("../controllers/events.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Events API
//@route GET /api/v1/events
//@access Private: Role Admin
router.get("/", validateToken, testEventsAPI);

//@desc Create New Event
//@route POST /api/v1/events/add
//@access Private: Admin
router.post(
  "/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("start_date", "Enter a valid Date").notEmpty(),
    body("end_date", "Enter a valid Date").notEmpty(),
  ],
  validateToken,
  createEvent
);

//@desc Update event with id
//@route PUT /api/v1/events/update/:id
//@access Private: Admin
router.put(
  "/update/:id",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("start_date", "Enter a valid Date"),
    body("end_date", "Enter a valid Date"),
  ],
  validateToken,
  updateEvent
);

//@desc Delete event with id (we are updating active to false )
//@route PUT /api/v1/events/delete/:id
//@access private: Role Admin
router.put("/delete/:id", validateToken, deleteEvent);

//@desc Get all events
//@route GET /api/v1/events/getall
//@access private: Role Admin
router.get("/getall", validateToken, getEvents);

//@desc Get event by id
//@route GET /api/v1/events/get/:id
//@access private: Role Admin
router.get("/get/:id", validateToken, getEvent);

module.exports = router;
