const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Department = require("../models/Department.js");

//@desc Test Department API
//@route GET /api/v1/department
//@access Private: Role Admin
const testDepartmentAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/department | User: ${user.name} | responnded with Department Api Successful `
    );
    return res.status(200).send({ data: user, message: "Role Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/department | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Department
//@route POST /api/v1/department/add
//@access Private: Role Admin
const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/department/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldDepartment = await Department.findOne({ name: data.name });
    if (oldDepartment) {
      logger.error(
        `${ip}: API /api/v1/department/add | User: ${user.name} | responnded with Department already Exists! for Role: ${data.name} `
      );
      return res.status(400).json({ message: "Department already Exists!" });
    }

    await Department.create({
      name: data.name,
    })
      .then((department) => {
        logger.info(
          `${ip}: API /api/v1/department/add | User: ${user.name} | responnded with Success `
        );
        return res.status(201).json(department);
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/department/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/department/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update Department with id
//@route PUT /api/v1/Department/update/:id
//@access Private: Role Admin
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = req.user;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/department/update/:${id} | User: ${user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (user) {
      const updatedDepartment = {
        name,
      };

      const oldDepartment = await Department.findOne({ _id: id });
      if (oldDepartment) {
        const result = await Department.findByIdAndUpdate(
          id,
          updatedDepartment,
          {
            new: true,
          }
        );
        logger.info(
          `${ip}: API /api/v1/department/update/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Department Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/department/update/:${id} | User: ${user.name} | responnded with Role Not Found `
        );
        return res.status(200).json({ message: "Department Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/department/update | User: ${user.name} | responnded with User is not Autherized `
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

//@desc Delete Department with id (we are updating active to false )
//@route PUT /api/v1/department/delete/:id
//@access private: Role Admin
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user) {
      const updatedDepartment = {
        active: false,
      };
      const oldDepartment = await Department.findOne({ _id: id });
      if (oldDepartment) {
        const result = await Department.findByIdAndUpdate(
          id,
          updatedDepartment,
          {
            new: true,
          }
        );
        logger.info(
          `${ip}: API /api/v1/department/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Department Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/department/delete/:${id} | User: ${user.name} | responnded with Department Not Found `
        );
        return res.status(200).json({ message: "Department Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/department/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
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

//@desc Get all Department
//@route GET /api/v1/department/getall
//@access private: Role Admin
const getDepartments = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  try {
    if (user) {
      const departments = await Department.find({
        active: true,
      });
      logger.info(
        `${ip}: API /api/v1/department/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: departments,
        message: "Department retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/department/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/department/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get Department by id
//@route GET /api/v1/department/get/:id
//@access private: Role Admin
const getDepartment = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const department = await Department.find({
        _id: id,
      });
      if (department.length > 0) {
        logger.info(
          `${ip}: API /api/v1/department/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: department,
          message: "Department retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/department/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Department was not found `
        );
        return await res.status(200).json({
          message: "Department Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/department/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/department/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  testDepartmentAPI,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartments,
  getDepartment,
};
