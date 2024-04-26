const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testUserAPI,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  logIn,
  getCurrent,
  AppDisUser,
  changePass,
} = require("../controllers/user");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test User API
//@route GET /api/v1/user
//@access Private: Role Super Admin
router.get("/", validateToken, testUserAPI);

//@desc Create New User
//@route POST /api/v1/user/add
//@access Private: Role Super Admin
router.post(
  "/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("whatsapp_no", "Enter a Valid Whatsapp Number").notEmpty().isNumeric(),
    body("password", "Password must have atlest 5 character").isLength({
      min: 5,
    }),
    body("roleType", "Select a valid role type").notEmpty(),
    body("joining_date", "Enter a Valid Joining Date").notEmpty(),
    body("department", "Enter a Valid Department").notEmpty(),
    body("team", "Enter a Valid Team").notEmpty(),
    body("linkUIEnable"),
    body("userUIEnable"),
    body("roleUIEnable"),
    body("qaUIEnable"),
    body("daUIEnable"),
    body("retriveUIEnable"),
    body("departmentUIEnable"),
    body("CRMUIEnable"),
  ],
  validateToken,
  createUser
);

//@desc Get all Users
//@route GET /api/v1/user/getall
//@access Private: Role Super Admin
router.get("/getall", validateToken, getUsers);

//@desc Get User with id
//@route GET /api/v1/user/get/:id
//@access Private: Role Super Admin
router.get("/get/:id", validateToken, getUser);

//@desc Update User with id
//@route PUT /api/v1/user/update/:id
//@access Private: Role Super Admin
router.put(
  "/update/:id",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("whatsapp_no", "Enter a Valid Whatsapp Number").notEmpty().isNumeric(),
    body("joining_date", "Enter a Valid Joining Date").notEmpty(),
    body("roleType", "Enter a Valid Role").notEmpty(),
    body("department", "Enter a Valid Department").notEmpty(),
    body("team", "Enter a Valid Team").notEmpty(),
  ],
  validateToken,
  updateUser
);

//@desc Delete User with id (we are updating active to false )
//@route PUT /api/v1/user/delete/:id
//@access Private: Role Super Admin
router.put("/delete/:id", validateToken, deleteUser);

//@desc Update User approved with id (we are updating active to false )
//@route PUT /api/v1/user/app_dis/:id
//@access Private: Role Super Admin
router.put("/app_dis/:id", validateToken, AppDisUser);

//@desc Change password of User with id
//@route PUT /api/v1/user/chnage/pass/:id
//@access Private: Role Super Admin
router.put("/change/pass/:id", validateToken, changePass);

//@desc User Login with email and password
//@route POST /api/v1/user/login/
//@access PUBLIC
router.post(
  "/login/",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must have atlest 5 character").notEmpty(),
  ],
  logIn
);

//@desc Get current Logged in USer
//@route POST /api/v1/user/getCurrent/
//@access Private: Needs Login
router.get("/getCurrent/", validateToken, getCurrent);

module.exports = router;
