const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Role = require("../models/Role.js");

//@desc Test Role API
//@route GET /api/v1/role
//@access Private: Role Admin
const testRoleAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/role | User: ${user.name} | responnded with Role Api Successful `
    );
    return res.status(200).send({ data: user, message: "Role Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/role | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Role
//@route POST /api/v1/role/add
//@access Private: Role Admin
const createRole = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/role/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldRole = await Role.findOne({ name: data.name });
    if (oldRole) {
      logger.error(
        `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with Role already Exists! for Role: ${data.name} `
      );
      return res.status(400).json({ message: "Role already Exists!" });
    }

    await Role.create({
      name: data.name,
    })
      .then((role) => {
        logger.info(
          `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(role);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update Role with id
//@route PUT /api/v1/role/update/:id
//@access Private: Role Admin
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = req.user;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/role/update/:${id} | User: ${user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (user) {
      const updatedRole = {
        name,
      };

      const oldRole = await Role.findOne({ _id: id });
      if (oldRole) {
        const result = await Role.findByIdAndUpdate(id, updatedRole, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/role/update/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Role Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/role/update/:${id} | User: ${user.name} | responnded with Role Not Found `
        );
        return res.status(200).json({ message: "Role Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/role/update | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/role/update/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Delete Role with id (we are updating active to false )
//@route PUT /api/v1/role/delete/:id
//@access private: Role Admin
const deleteRole = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedRole = {
        active: false,
      };
      const oldRole = await Role.findOne({ _id: id });
      if (oldRole) {
        const result = await Role.findByIdAndUpdate(id, updatedRole, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/role/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Role Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/role/delete/:${id} | User: ${user.name} | responnded with Role Not Found `
        );
        return res.status(200).json({ message: "Role Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/role/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/role/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Get all Roles
//@route GET /api/v1/roles/getall
//@access private: Role Admin
const getRoles = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const roles = await Role.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/role/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: roles,
        message: "Roles retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/role/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/role/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get Role by id
//@route GET /api/v1/roles/get/:id
//@access private: Role Admin
const getRole = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const role = await Role.find({
        _id: id,
      });
      if (role.length > 0) {
        logger.info(
          `${ip}: API /api/v1/role/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: role,
          message: "Role retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/role/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Role was not found `
        );
        return await res.status(200).json({
          message: "Role Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/role/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/role/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  testRoleAPI,
  createRole,
  updateRole,
  deleteRole,
  getRoles,
  getRole,
};
