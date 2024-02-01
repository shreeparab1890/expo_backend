const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testLinkAPI,
  createLink,
  assignLink,
  unassignLink,
  getAllLinks,
  getAllLinksData,
  getAllLinksDataQA,
  getLink,
  getAllLinksbyUser,
  changeRemark,
  changeStatus,
  changeAllStatus,
  UpdateLink,
  getLink_generalise,
  deleteLink,
  getFilterLinks,
  getLinkLeaderboard,
  getLinkLeaderToday,
  getLinksByEmail,
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
    body("value", "Enter a valid Link URL").isLength({ min: 3 }),
    body("priority", "Enter a valid priority").isLength({ min: 2 }),
    body("link_type", "Enter a valid Link_type").isLength({ min: 2 }),
    body("category", "Enter a valid Link Category").isLength({ min: 2 }),
    body("start_date"),
    body("end_date"),
    body("month"),
    body("year"),
    body("mode", "Enter the valid Mode").isLength({ min: 2 }),
    body("country", "Enter the valid Country").isLength({ min: 2 }),
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
    body("name", "Enter a valid Link name").isLength({ min: 2 }),
    body("value", "Enter a valid Link").isLength({ min: 2 }),
    body("priority", "Enter a valid Link").isLength({ min: 2 }),
    body("link_type", "Enter a valid Link").isLength({ min: 2 }),
    body("category", "Enter a valid Link Category").isLength({ min: 2 }),
    body("start_date"),
    body("end_date"),
    body("month"),
    body("year"),
    body("mode", "Enter the valid Mode").isLength({ min: 2 }),
    body("country", "Enter the valid Country").isLength({ min: 2 }),
    body("link_comment", "Enter Link Comment"),
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
//@route POST /api/v1/link/getall
//@access Private: Role Admin / superadmin
router.get("/getall", validateToken, getAllLinks);

//@desc Get all Links with data
//@route POST /api/v1/link/getall/data
//@access Private: Role Admin / superadmin
router.get("/getall/data", validateToken, getAllLinksData);

//@desc Get all Links with data QA (approved = false)
//@route POST /api/v1/link/getall/data/qa
//@access Private: Role Admin / superadmin
router.get("/getall/data/qa", validateToken, getAllLinksDataQA);

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
    body("object_id"),
  ],
  validateToken,
  changeStatus
);

//@desc Change status for all by link id
//@route GET /api/v1/link/change/all/status/:id
//@access private: login required
router.put(
  "/change/all/status/:id",
  [body("status", "Enter a valid Status").isLength({ min: 1 })],
  validateToken,
  changeAllStatus
);

//@desc Delete link with id (we are updating active to false )
//@route PUT /api/v1/link/delete/:id
//@access private: Role Super Admin
router.put("/delete/:id", validateToken, deleteLink);

//@desc filter Links
//@route post /api/v1/link/filter
//@access private: login required
router.post("/filter", validateToken, getFilterLinks);

//@desc Get all Links by email
//@route POST /api/v1/link/get/email
//@access Private: Role Admin / superadmin
router.post(
  "/get/email",
  [body("email", "Enter a valid email").isEmail()],
  validateToken,
  getLinksByEmail
);

//@desc get add link leader
//@route get /api/v1/link/get/link/leaderboard
//@access private: login required
router.get("/get/link/leaderboard", validateToken, getLinkLeaderboard);

//@desc get add link leader board
//@route get /api/v1/link/get/leader/today
//@access private: login required
router.get("/get/leader/today", validateToken, getLinkLeaderToday);

module.exports = router;
