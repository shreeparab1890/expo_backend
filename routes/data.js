const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testUserAPI,
  createData,
  getAllData,
  getDataById,
  getDataByLinkId,
  approveData,
  updateData,
  getDataByUserId,
} = require("../controllers/data");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
router.get("/", validateToken, testUserAPI);

//@desc Create New Data
//@route GET /api/v1/data/add
//@access Private: Login Required
router.post(
  "/add",
  [
    body("company_name", "Enter a valid Company name").isLength({ min: 1 }),
    body("website", "Enter a valid website url").notEmpty(),
    body("email", "Enter a valid Email").isEmail(),
    body("category", "Enter a valid category").notEmpty(),
    body("status", "Enter a valid status").notEmpty(),
    body("country", "Enter a valid country").notEmpty(),
    body("region", "Enter a valid region").notEmpty(),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products").notEmpty(),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("city", "Enter a valid city"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
    body("user", "Enter a valid User ID").notEmpty(),
    body("link", "Enter a valid link ID").notEmpty(),
  ],
  validateToken,
  createData
);

//@desc Approve by data id
//@route GET /api/v1/data/approve/:id
//@access private: login required
router.put("/approve/:id", validateToken, approveData);

//@desc Get all Data
//@route POST /api/v1/data/getall
//@access Private: login required
router.get("/getall", validateToken, getAllData);

//@desc Get Data by id
//@route GET /api/v1/data/get/:id
//@access private: login required
router.get("/get/:id", validateToken, getDataById);

//@desc Get Data by Link id
//@route GET /api/v1/data/get/link/:id
//@access private: login required
router.get("/get/link/:id", validateToken, getDataByLinkId);

//@desc update Data by data id
//@route put /api/v1/data/update/:id
//@access private: login required
router.put(
  "/update/:id",
  [
    body("company_name", "Enter a valid Company name").isLength({ min: 1 }),
    body("website", "Enter a valid website url").notEmpty(),
    body("email", "Enter a valid Email").isEmail(),
    body("category", "Enter a valid category").notEmpty(),
    body("status", "Enter a valid status").notEmpty(),
    body("country", "Enter a valid country").notEmpty(),
    body("region", "Enter a valid region").notEmpty(),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products").notEmpty(),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("city", "Enter a valid city"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
  ],
  validateToken,
  updateData
);

//@desc Get Data by user id
//@route GET /api/v1/data/user/get
//@access private: login required
router.get("/user/get", validateToken, getDataByUserId);

module.exports = router;
