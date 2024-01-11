const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Events = require("../models/Events.js");

//@desc Test Events API
//@route GET /api/v1/events
//@access Private: Role Admin
const testEventsAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/Events | User: ${user.name} | responnded with Events Api Successful `
    );
    return res
      .status(200)
      .send({ data: user, message: "Events Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/Events | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Event
//@route POST /api/v1/events/add
//@access Private: Admin
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/events/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldEvent = await Events.findOne({ name: data.name });
    if (oldEvent) {
      logger.error(
        `${ip}: API /api/v1/events/add | User: ${user.name} | responnded with Event already Exists! for Event: ${data.name} `
      );
      return res.status(400).json({ message: "Event already Exists!" });
    }

    await Events.create({
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
    })
      .then((event) => {
        logger.info(
          `${ip}: API /api/v1/events/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(event);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/events/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/events/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update event with id
//@route PUT /api/v1/events/update/:id
//@access Private: Admin
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, start_date, end_date } = req.body;

  const user = req.user;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/events/update/:${id} | User: ${user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (user) {
      const updatedEvent = {
        name,
        start_date,
        end_date,
        UpdatedDate: Date.now(),
      };

      const oldEvent = await Events.findOne({ _id: id });
      if (oldEvent) {
        const result = await Events.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/events/update/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Event Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/events/update/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Event Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/events/update | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/update/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Delete event with id (we are updating active to false )
//@route PUT /api/v1/events/delete/:id
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
      const oldEvent = await Events.findOne({ _id: id });
      if (oldEvent) {
        const result = await Events.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/events/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Event Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/events/delete/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Event Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/events/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Get all events
//@route GET /api/v1/events/getall
//@access private: Role Admin
const getEvents = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const events = await Events.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/events/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: events,
        message: "Events retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/events/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get event by id
//@route GET /api/v1/events/get/:id
//@access private: Role Admin
const getEvent = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const events = await Events.find({
        _id: id,
      });
      if (events.length > 0) {
        logger.info(
          `${ip}: API /api/v1/events/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: events,
          message: "Event retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/events/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Event was not found `
        );
        return await res.status(200).json({
          message: "Event Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/events/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc disapprove event with id (we are updating approve to false )
//@route PUT /api/v1/events/disapprove/:id
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
      const oldEvent = await Events.findOne({ _id: id });
      if (oldEvent) {
        const result = await Events.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/events/disapprove/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Event disapproved Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/events/disapprove/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Event Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/events/disapprove/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/disapprove/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc approve event with id (we are updating approve to true )
//@route PUT /api/v1/events/approve/:id
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
      const oldEvent = await Events.findOne({ _id: id });
      if (oldEvent) {
        const result = await Events.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/events/approve/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Event approved Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/events/approve/:${id} | User: ${user.name} | responnded with Event Not Found `
        );
        return res.status(200).json({ message: "Event Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/events/approve/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/events/approve/:${id} | User: ${user.name} | responnded with Error `
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
  disapproveEvent,
  approveEvent,
};
