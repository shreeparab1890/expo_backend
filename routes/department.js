const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testDepartmentAPI,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartments,
  getDepartment,
} = require("../controllers/department.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Department API
//@route GET /api/v1/department
//@access Private: Role Admin
router.get("/", validateToken, testDepartmentAPI);

//@desc Create New Department
//@route POST /api/v1/department/add
//@access Private: Role Admin
router.post(
  "/add",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  createDepartment
);

//@desc Update Department with id
//@route PUT /api/v1/Department/update/:id
//@access Private: Role Admin
router.put(
  "/update/:id",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  updateDepartment
);

//@desc Delete Department with id (we are updating active to false )
//@route PUT /api/v1/department/delete/:id
//@access private: Role Admin
router.put("/delete/:id", validateToken, deleteDepartment);

//@desc Get all Department
//@route GET /api/v1/department/getall
//@access private: Role Admin
router.get("/getall", validateToken, getDepartments);

//@desc Get Department by id
//@route GET /api/v1/department/get/:id
//@access private: Role Admin
router.get("/get/:id", validateToken, getDepartment);

module.exports = router;
