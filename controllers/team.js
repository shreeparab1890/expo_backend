const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Team = require("../models/Team.js");

//@desc Test Team API
//@route GET /api/v1/team
//@access Private: Role Admin
const testTeamAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/team | User: ${user.name} | responnded with Department Api Successful `
    );
    return res.status(200).send({ data: user, message: "Team Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/team | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Team
//@route POST /api/v1/team/add
//@access Private: Role Admin
const createTeam = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/team/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldDepartment = await Team.findOne({ name: data.name });
    if (oldDepartment) {
      logger.error(
        `${ip}: API /api/v1/team/add | User: ${user.name} | responnded with team already Exists! for Name: ${data.name} `
      );
      return res.status(400).json({ message: "Team already Exists!" });
    }

    await Team.create({
      name: data.name,
    })
      .then((team) => {
        logger.info(
          `${ip}: API /api/v1/team/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(team);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/team/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/team/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update Team with id
//@route PUT /api/v1/team/update/:id
//@access Private: Role Admin
const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = req.user;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/team/update/:${id} | User: ${user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (user) {
      const updatedDepartment = {
        name,
      };

      const oldDepartment = await Team.findOne({ _id: id });
      if (oldDepartment) {
        const result = await Team.findByIdAndUpdate(id, updatedDepartment, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/team/update/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Team Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/team/update/:${id} | User: ${user.name} | responnded with Role Not Found `
        );
        return res.status(200).json({ message: "Team Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/team/update | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/team/update/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Delete Team with id (we are updating active to false )
//@route PUT /api/v1/team/delete/:id
//@access private: Role Admin
const deleteTeam = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedDepartment = {
        active: false,
      };
      const oldDepartment = await Team.findOne({ _id: id });
      if (oldDepartment) {
        const result = await Team.findByIdAndUpdate(id, updatedDepartment, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/team/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Team Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/team/delete/:${id} | User: ${user.name} | responnded with Team Not Found `
        );
        return res.status(200).json({ message: "Team Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/team/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/team/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Get all Teams
//@route GET /api/v1/team/getall
//@access private: Role Admin
const getTeams = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const departments = await Team.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/team/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: departments,
        message: "Teams retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/team/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/team/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get Team by id
//@route GET /api/v1/team/get/:id
//@access private: Role Admin
const getTeam = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const department = await Team.find({
        _id: id,
      });
      if (department.length > 0) {
        logger.info(
          `${ip}: API /api/v1/team/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: department,
          message: "Team retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/team/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Team was not found `
        );
        return await res.status(200).json({
          message: "Team Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/team/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/team/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  testTeamAPI,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeams,
  getTeam,
};
