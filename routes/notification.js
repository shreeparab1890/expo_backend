const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  addNotification,
  deleteNotification,
  getNotifications,
  getNotification,
  dismissNotification,
  getNotificationByUser,
} = require("../controllers/notification.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Create New Notification
//@route POST /api/v1/notification/add
//@access Private: Login Required
router.post(
  "/add",
  [
    body("text", "Enter a valid text").isLength({ min: 3 }),
    body("type", "Enter a valid type"),
    body("to_user", "Provide a valid User").notEmpty(),
  ],
  validateToken,
  addNotification
);

//@desc Delete Notification with id (we are updating active to false )
//@route PUT /api/v1/notification/delete/:id
//@access private: Login Required
router.put("/delete/:id", validateToken, deleteNotification);

//@desc Get all notifications
//@route GET /api/v1/notification/getall
//@access private: Login Required
router.get("/getall", validateToken, getNotifications);

//@desc Get notification by id
//@route GET /api/v1/notification/get/:id
//@access private: Login Required
router.get("/get/:id", validateToken, getNotification);

//@desc dismiss a notification  y id
//@route PUT /api/v1/notification/dismiss/:id
//@access private: Login Required
router.put("/dismiss/:id", validateToken, dismissNotification);

//@desc get notification by user_id
//@route PUT /api/v1/notification/user/get
//@access private: Login Required
router.get("/user/get", validateToken, getNotificationByUser);

module.exports = router;
