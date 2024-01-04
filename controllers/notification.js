const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Notifications = require("../models/Notification.js");

//@desc Create New Notification
//@route POST /api/v1/notification/add
//@access Private: Login Required
const addNotification = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/notification/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    await Notifications.create({
      text: data.text,
      type: data.type,
      to_user: data.to_user,
      by_user: user._id,
    })
      .then((notification) => {
        logger.info(
          `${ip}: API /api/v1/notification/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(notification);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/notification/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/notification/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Delete Notification with id (we are updating active to false )
//@route PUT /api/v1/notification/delete/:id
//@access private: Login Required
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedNotification = {
        active: false,
      };
      const oldNotification = await Notifications.findOne({ _id: id });
      if (oldNotification) {
        const result = await Notifications.findByIdAndUpdate(
          id,
          updatedNotification,
          {
            new: true,
          }
        );
        logger.info(
          `${ip}: API /api/v1/notification/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Notification Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/notification/delete/:${id} | User: ${user.name} | responnded with Notification Not Found `
        );
        return res.status(200).json({ message: "Notification Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/notification/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/notification/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Get all notification
//@route GET /api/v1/notification/getall
//@access private: Login Required
const getNotifications = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const notification = await Notifications.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/notification/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: notification,
        message: "Notifications retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/notification/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/notification/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get notification by id
//@route GET /api/v1/notification/get/:id
//@access private: Login Required
const getNotification = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const notification = await Notifications.find({
        _id: id,
      });
      if (notification.length > 0) {
        logger.info(
          `${ip}: API /api/v1/notification/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: notification,
          message: "Notification retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/notification/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Notification was not found `
        );
        return await res.status(200).json({
          message: "Notification Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/notification/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/notification/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc dismiss a notification  y id
//@route GET /api/v1/notification/dismiss/:id
//@access private: Login Required
const dismissNotification = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedNotification = {
        dismissed: true,
      };
      const oldNotification = await Notifications.findOne({ _id: id });
      if (oldNotification) {
        const result = await Notifications.findByIdAndUpdate(
          id,
          updatedNotification,
          {
            new: true,
          }
        );
        logger.info(
          `${ip}: API /api/v1/notification/dismiss/:${id} | User: ${user.name} | responnded with Success `
        );
        return res.status(200).json({
          data: result,
          message: "Notification Dismissied Successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/notification/dismiss/:${id} | User: ${user.name} | responnded with Notification Not Found `
        );
        return res.status(200).json({ message: "Notification Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/notification/dismiss/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/notification/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc get notification by user_id
//@route PUT /api/v1/notification/get/byuser/:id
//@access private: Login Required
const getNotificationByUser = async (req, res) => {
  console.log("In vvv");
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const notification = await Notifications.find({
        to_user: loggedin_user._id,
        active: true,
        dismissed: false,
      });
      if (notification.length > 0) {
        logger.info(
          `${ip}: API /api/v1/notification/get/byuser | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: notification,
          message: "Notifications retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/notification/get/byuser | User: ${loggedin_user.name} | responnded Empty i.e. Notification was not found `
        );
        return await res.status(200).json({
          message: "Notifications Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/notification/get/byuser | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/notification/get/byuser | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ error, message: "Something went wrong1aa" });
  }
};

module.exports = {
  addNotification,
  deleteNotification,
  getNotifications,
  getNotification,
  dismissNotification,
  getNotificationByUser,
};
