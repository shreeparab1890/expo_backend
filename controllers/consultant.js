const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Consultant = require("../models/Consultant.js");

//@desc Test Consultant API
//@route GET /api/v1/consultant
//@access Private: Role Admin
const testEventsAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/consultant | User: ${user.name} | responnded with Events Api Successful `
    );
    return res
      .status(200)
      .send({ data: user, message: "Consultant Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/consultant | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Consultant
//@route POST /api/v1/consultant/add
//@access Private: Admin
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/consultant/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldCon = await Consultant.findOne({ name: data.name });
    if (oldCon) {
      logger.error(
        `${ip}: API /api/v1/consultant/add | User: ${user.name} | responnded with consultant already Exists! for consultant: ${data.name} `
      );
      return res.status(400).json({ message: "Consultant already Exists!" });
    }

    await Consultant.create({
      name: data.name,
    })
      .then((con) => {
        logger.info(
          `${ip}: API /api/v1/consultant/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(con);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/consultant/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/consultant/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update consultant with id
//@route PUT /api/v1/consultant/update/:id
//@access Private: Admin
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = req.user;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/consultant/update/:${id} | User: ${user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (user) {
      const updatedEvent = {
        name,
        UpdatedDate: Date.now(),
      };

      const oldcon = await Consultant.findOne({ _id: id });
      if (oldcon) {
        const result = await Consultant.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/consultant/update/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Consultant Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/consultant/update/:${id} | User: ${user.name} | responnded with consultant Not Found `
        );
        return res.status(200).json({ message: "Consultant Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/update | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/update/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Delete consultant with id (we are updating active to false )
//@route PUT /api/v1/consultant/delete/:id
//@access private: Role Admin
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedEvent = {
        active: false,
        UpdatedDate: Date.now(),
      };
      const oldEvent = await Consultant.findOne({ _id: id });
      if (oldEvent) {
        const result = await Consultant.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/consultant/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Consultant Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/consultant/delete/:${id} | User: ${user.name} | responnded with consultant Not Found `
        );
        return res.status(200).json({ message: "Consultant Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Get all consultant
//@route GET /api/v1/consultant/getall
//@access private: Role Admin
const getEvents = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const events = await Consultant.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/consultant/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: events,
        message: "Consultats retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get consultant by id
//@route GET /api/v1/consultant/get/:id
//@access private: Role Admin
const getEvent = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const events = await Consultant.find({
        _id: id,
      });
      if (events.length > 0) {
        logger.info(
          `${ip}: API /api/v1/consultant/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: events,
          message: "Consultant retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/consultant/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. consultant was not found `
        );
        return await res.status(200).json({
          message: "Consultant Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc approve cosultant with id (we are updating approve to true )
//@route PUT /api/v1/consultant/approve/:id
//@access private: Role Admin
const approveEvent = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedEvent = {
        approve: true,
        UpdatedDate: Date.now(),
      };
      const oldEvent = await Consultant.findOne({ _id: id });
      if (oldEvent) {
        const result = await Consultant.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/consultant/approve/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Consultant approved Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/consultant/approve/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Consultant Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/approve/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/approve/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc dis approve cosultant with id (we are updating approve to true )
//@route PUT /api/v1/consultant/disapprove/:id
//@access private: Role Admin
const disapproveEvent = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedEvent = {
        approve: false,
        UpdatedDate: Date.now(),
      };
      const oldEvent = await Consultant.findOne({ _id: id });
      if (oldEvent) {
        const result = await Consultant.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/consultant/disapprove/:${id} | User: ${user.name} | responnded with Success `
        );
        return res.status(200).json({
          data: result,
          message: "Consultant dis approved Successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/consultant/disapprove/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Consultant Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/consultant/disapprove/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/consultant/disapprove/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

module.exports = {
  testEventsAPI,
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEvent,
  approveEvent,
  disapproveEvent,
};
