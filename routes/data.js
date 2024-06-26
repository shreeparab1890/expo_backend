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
  bulkApproveData,
  updateData,
  getDataByUserId,
  getDataByCreatedDate,
  getDataByCreatedDate_link,
  getDataByGeneraliseFilter,
  getDataByLinkId_user,
  getFilterData,
  getRetriveFilterData,
  getDataByEmail_LinkID,
  getDataByEmail,
  verifyWhatsappNumber,
  getDataLeaderboard,
  getApprovedDataLeader,
  getDataLeaderToday,
  getDataLeaderYesterday,
  getDataLeaderThisWeek,
  getDataLeaderLastWeek,
  getDataLeaderThisMonth,
  getDataLeaderLastMonth,
  getNewData,
  getDataByLinkID,
  checkEmailDomain,
  updateStatusData,
  checkLinkDuplicate,
  getDashboardDataTypeCount,
  exportDashboardDataTypeCount,
  getCategoryDataCount,
  uploadData,
  updateDomainData,
} = require("../controllers/data");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
router.get("/", validateToken, testUserAPI);

//@desc verify whatsapp number
//@route GET /api/v1/data/verify/whatsapp
//@access Private: Login Required
router.get("/verify/whatsapp", verifyWhatsappNumber);

//@desc Create New Data
//@route GET /api/v1/data/add
//@access Private: Login Required
router.post(
  "/add",
  [
    body("company_name", "Enter a valid Company name"),
    body("website", "Enter a valid website url"),
    body("email", "Enter a valid Email").isEmail(),
    body("category", "Enter a valid category").notEmpty(),
    body("status", "Enter a valid status").isLength({ min: 2 }),
    body("country", "Enter a valid country").isLength({ min: 2 }),
    body("region", "Enter a valid region").notEmpty(),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products"),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("whatsApp", "Enter a valid whatsApp Number"),
    body("city", "Enter a valid city"),
    body("exhibitor_type", "Enter a valid Exhibitor Type"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
    body("comment1", "Enter a valid commnet1"),
    body("user", "Enter a valid User ID").notEmpty(),
    body("link", "Enter a valid link ID").notEmpty(),
    body("pooledOldData", "Enter a valid link ID"),
  ],
  validateToken,
  createData
);

//@desc Approve by data id
//@route GET /api/v1/data/approve/:id
//@access private: login required
router.put("/approve/:id", validateToken, approveData);

//@desc bulk Approve by data id
//@route POST /api/v1/data/bulk/approve/:id
//@access private: login required
router.post("/bulk/approve", [body("dataIds")], validateToken, bulkApproveData);

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

//@desc Get Data by Link id and user id
//@route GET /api/v1/data/get/link/user/:id
//@access private: login required
router.get("/get/link/user/:id", validateToken, getDataByLinkId_user);

//@desc update Data by data id
//@route put /api/v1/data/update/:id
//@access private: login required
router.put(
  "/update/:id",
  [
    body("company_name", "Enter a valid Company name"),
    body("website", "Enter a valid website url"),
    body("email", "Enter a valid Email").isEmail(),
    body("category", "Enter a valid category").notEmpty(),
    body("status", "Enter a valid status").isLength({ min: 2 }),
    body("country", "Enter a valid country").isLength({ min: 2 }),
    body("region", "Enter a valid region").notEmpty(),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products"),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("whatsApp", "Enter a valid whatsApp Number"),
    body("city", "Enter a valid city"),
    body("exhibitor_type", "Enter a valid Exhibitor Type"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
    body("comment1", "Enter a valid commnet1"),
  ],
  validateToken,
  updateData
);

//@desc Get Data by user id
//@route GET /api/v1/data/user/get
//@access private: login required
router.get("/user/get", validateToken, getDataByUserId);

//@desc Get Data by created date
//@route GET /api/v1/data/date/get/
//@access private: login required
router.post("/date/get", validateToken, getDataByCreatedDate);

//@desc Get Data by created date and link
//@route GET /api/v1/data/date/link/get/
//@access private: login required
router.post("/date/link/get", validateToken, getDataByCreatedDate_link);

//@desc Get Data by generalise filter
//@route GET /api/v1/data/generalise/get
//@access private: login required
router.post("/generalise/get", validateToken, getDataByGeneraliseFilter);

//@desc filter Data
//@route POST /api/v1/data/filter
//@access private: login required
router.post("/filter", validateToken, getFilterData);

//@desc get new or old data
//@route POST /api/v1/data/new/filter
//@access private: login required
router.post("/new/filter", validateToken, getNewData);

//@desc retrive filter Data
//@route POST /api/v1/data/retrive/filter
//@access private: login required
router.post("/retrive/filter", validateToken, getRetriveFilterData);

//@desc Get Data by email and link id
//@route POST /api/v1/data/get/byemail
//@access private: login required
router.post("/get/byemail", validateToken, getDataByEmail_LinkID);

router.post("/get/bylinkid", validateToken, getDataByLinkID);

//@desc Get Data by email and category
//@route POST /api/v1/data/get/byemail/cat
//@access private: login required
router.post("/get/byemail/cat", validateToken, getDataByEmail);

//@desc get add data leader board
//@route get /api/v1/data/get/leader
//@access private: login required
router.post("/get/leader", validateToken, getDataLeaderboard);
router.post("/get/cat/count", validateToken, getCategoryDataCount);

//@desc get add data leader board
//@route get /api/v1/data/get/leader
//@access private: login required
router.post("/get/approved/leader", validateToken, getApprovedDataLeader);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/today
//@access private: login required
router.post("/get/leader/today", validateToken, getDataLeaderToday);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/thisweek
//@access private: login required
router.post("/get/leader/thisweek", validateToken, getDataLeaderThisWeek);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/yesterday
//@access private: login required
router.post("/get/leader/yesterday", validateToken, getDataLeaderYesterday);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/lastweek
//@access private: login required
router.post("/get/leader/lastweek", validateToken, getDataLeaderLastWeek);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/thismonth
//@access private: login required
router.post("/get/leader/thismonth", validateToken, getDataLeaderThisMonth);

//@desc get add data leader board today
//@route post /api/v1/data/get/leader/lastmonth
//@access private: login required
router.post("/get/leader/lastmonth", validateToken, getDataLeaderLastMonth);

//@desc Get Data by check email domain
//@route POST /api/v1/data/check/email/domain
//@access private: login required
router.post("/check/email/domain", validateToken, checkEmailDomain);

//@desc update status by data id
//@route GET /api/v1/data/update/status/:id
//@access private: login required
router.post("/status/update/:id", validateToken, updateStatusData);

router.post(
  "/dashboard/data/type/count",
  validateToken,
  getDashboardDataTypeCount
);

router.post(
  "/export/dashboard/data/type/count",
  validateToken,
  exportDashboardDataTypeCount
);

router.get(
  "/duplicate/check/link/:dataId/:linkId",
  validateToken,
  checkLinkDuplicate
);

//@desc upload data
//@route GET /api/v1/data/upload
//@access private: login required
router.post("/upload", validateToken, uploadData);

router.post("/update/domain", validateToken, updateDomainData);
module.exports = router;
