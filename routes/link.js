const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testLinkAPI,
  createLink,
  assignLink,
  unassignLink,
  getAllLinks,
  getLink,
  getAllLinksbyUser,
  changeRemark,
  changeStatus,
  UpdateLink,
  getLink_generalise,
} = require("../controllers/link.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Link API
//@route GET /api/v1/link
//@access Private: Role Admin / superadmin
router.get("/", validateToken, testLinkAPI);

//@desc Create New Link
//@route POST /api/v1/link/add
//@access Private: Role Admin / superadmin
router.post(
  "/add",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("value", "Enter a valid Link").isLength({ min: 3 }),
    body("priority", "Enter a valid Link").isLength({ min: 1 }),
    body("link_type", "Enter a valid Link").isLength({ min: 1 }),
    body("start_date"),
    body("end_date"),
    body("month"),
    body("year"),
    body("mode"),
    body("country"),
    body("link_comment"),
  ],
  validateToken,
  createLink
);

//@desc Update  Link
//@route POST /api/v1/link/update/:id
//@access Private: Role Admin / superadmin
router.put(
  "/update/:id",
  [
    body("priority", "Enter a valid Link").isLength({ min: 1 }),
    body("link_type", "Enter a valid Link").isLength({ min: 1 }),
    body("start_date"),
    body("end_date"),
    body("month"),
    body("year"),
    body("mode"),
    body("country"),
    body("link_comment"),
  ],
  validateToken,
  UpdateLink
);

//@desc Assign Link to user
//@route POST /api/v1/link/assign
//@access Private: Role Admin / superadmin
router.put(
  "/assign/:id",
  [
    body("assign_user", "Enter a valid User Id").isLength({ min: 7 }),
    body("remark", "Enter a Valid Remark").isLength({ min: 1 }),
  ],
  validateToken,
  assignLink
);

//@desc Assign Link to user
//@route POST /api/v1/link/unassign
//@access Private: Role Admin / superadmin
router.put("/unassign/:link_id/:assign_id", validateToken, unassignLink);

//@desc Get all Links
//@route POST /api/v1/link/assign
//@access Private: Role Admin / superadmin
router.get("/getall", validateToken, getAllLinks);

//@desc Get Link by id
//@route GET /api/v1/link/get/:id
//@access private: Admin/Superadmin
router.get("/get/:id", validateToken, getLink_generalise);

//@desc Get Link by id
//@route GET /api/v1/link/get/assign/:id
//@access private: Admin/Superadmin
router.get("/get/assign/:id", validateToken, getLink);

//@desc Get Links by user id
//@route GET /api/v1/link/get/user/:id
//@access private: login required
router.get("/get/user/:id", validateToken, getAllLinksbyUser);

//@desc Change remark by link id
//@route GET /api/v1/link/change/remark/:id
//@access private: login required
router.put(
  "/change/remark/:id",
  [body("remark", "Enter a valid Remark").isLength({ min: 3 })],
  validateToken,
  changeRemark
);

//@desc Change status by link id
//@route GET /api/v1/link/change/status/:id
//@access private: login required
router.put(
  "/change/status/:id",
  [
    body("status", "Enter a valid Status").isLength({ min: 1 }),
    body("compeleted_date"),
  ],
  validateToken,
  changeStatus
);

module.exports = router;
