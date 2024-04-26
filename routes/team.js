const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testTeamAPI,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeams,
  getTeam,
} = require("../controllers/team.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Department API
//@route GET /api/v1/department
//@access Private: Role Admin
router.get("/", validateToken, testTeamAPI);

//@desc Create New Department
//@route POST /api/v1/department/add
//@access Private: Role Admin
router.post(
  "/add",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  createTeam
);

//@desc Update Department with id
//@route PUT /api/v1/Department/update/:id
//@access Private: Role Admin
router.put(
  "/update/:id",
  [body("name", "Enter a valid name").isLength({ min: 3 })],
  validateToken,
  updateTeam
);

//@desc Delete Department with id (we are updating active to false )
//@route PUT /api/v1/department/delete/:id
//@access private: Role Admin
router.put("/delete/:id", validateToken, deleteTeam);

//@desc Get all Department
//@route GET /api/v1/department/getall
//@access private: Role Admin
router.get("/getall", validateToken, getTeams);

//@desc Get Department by id
//@route GET /api/v1/department/get/:id
//@access private: Role Admin
router.get("/get/:id", validateToken, getTeam);

module.exports = router;
