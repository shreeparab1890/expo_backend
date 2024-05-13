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
  getDataByCreatedDate,
  getDataByCreatedDate_link,
  getDataByGeneraliseFilter,
  getDataByEmail,
  getDataByEmail_1,
  getFilterData,
  getDataByEventID,
  checkEmailDomain,
  getCombinedFilterData,
  getDataByEmailDomain,
  updateDomainData,
} = require("../controllers/inquiryData");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Inquiry Data API
//@route GET /api/v1/inquirydata
//@access Private: Login Required
router.get("/", validateToken, testUserAPI);

//@desc Create New Inquiry Data
//@route GET /api/v1/inquiry/data/add
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
    body("inquired_event_name", "Enter a valid Event Name").isLength({
      min: 1,
    }),
    body("consultant_name", "Enter a valid Consultant Name").isLength({
      min: 2,
    }),
    body("inquiry_type", "Enter a valid Inquiry Source").isLength({ min: 2 }),
    body("inq_for", "Select a valid Inquiry Type"),
    body("exhi_for", "Select a valid Exhibitor For"),
    body("inquiry_source", "Enter a valid Data Source").notEmpty(),
    body("inquiry_date", "Enter a valid Inquiry Date").notEmpty(),
    body("exhibitor_date", "Enter a valid Exhibitor Date"),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products"),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("whatsapp", "Enter a valid WhatsApp"),
    body("city", "Enter a valid city"),
    body("exhibitor_type", "Enter a valid Exhibitor Type"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
    body("comment1", "Enter a valid commnet1"),
    body("user", "Enter a valid User ID").notEmpty(),
    body("pooledOldData", "Enter a valid User ID"),
  ],
  validateToken,
  createData
);

//@desc Get all inquiry Data
//@route POST /api/v1/inquiry/data/getall
//@access Private: login required
router.get("/getall", validateToken, getAllData);

//@desc Get inquiry Data by id
//@route GET /api/v1/inquiry/data/get/:id
//@access private: login required
router.get("/get/:id", validateToken, getDataById);

//@desc update inquiry Data by data id
//@route put /api/v1/inquiry/data/update/:id
//@access private: login required
router.put(
  "/update/:id",
  [
    body("company_name", "Enter a valid Company name"),
    body("website", "Enter a valid website url"),
    body("email", "Enter a valid Email").isEmail(),
    body("category", "Enter a valid category").isLength({ min: 2 }),
    body("status", "Enter a valid status").isLength({ min: 2 }),
    body("country", "Enter a valid country").isLength({ min: 2 }),
    body("region", "Enter a valid region").notEmpty(),
    body("inquired_event_name", "Enter a valid Event Name").notEmpty(),
    body("consultant_name", "Enter a valid Consultant Name").isLength({
      min: 2,
    }),
    body("inquiry_type", "Enter a valid Inquiry Source").isLength({ min: 2 }),
    body("inquiry_source", "Enter a valid Data Source").notEmpty(),
    body("inquiry_date", "Enter a valid Inquiry Date").notEmpty(),
    body("exhibitor_date", "Enter a valid Exhibitor Date"),
    body("contact_person", "Enter a valid contact person"),
    body("designation", "Enter a valid designation"),
    body("products", "Enter a valid products"),
    body("tel", "Enter a valid tel"),
    body("mobile", "Enter a valid mobile"),
    body("whatsapp", "Enter a whatsapp number"),
    body("city", "Enter a valid city"),
    body("exhibitor_type", "Enter a valid Exhibitor Type"),
    body("address", "Enter a valid address"),
    body("comment", "Enter a valid commnet"),
    body("comment1", "Enter a valid commnet1"),
  ],
  validateToken,
  updateData
);

//@desc Get inquiry Data by created date
//@route GET /api/v1/inquiry/data/date/get/
//@access private: login required
router.post("/date/get", validateToken, getDataByCreatedDate);

//@desc Get inq Data by email
//@route POST /api/v1/inquiry/data/get/byemail
//@access private: login required
router.post("/get/byemail", validateToken, getDataByEmail);

//@desc Get inq Data by email
//@route POST /api/v1/inquiry/data/get/byemail/1
//@access private: login required
router.post("/get/byemail/1", validateToken, getDataByEmail_1);

//@desc filter inq Data
//@route POST /api/v1/inquiry/data/filter
//@access private: login required
router.post("/filter", validateToken, getFilterData);
router.post("/master/filter", validateToken, getCombinedFilterData);

router.post("/get/byeventid", validateToken, getDataByEventID);

//@desc Get Data by check email domain
//@route POST /api/v1/inquiry/data/check/email/domain
//@access private: login required
router.post("/check/email/domain", validateToken, checkEmailDomain);

router.post("/bydomain", validateToken, getDataByEmailDomain);
router.post("/update/domain", validateToken, updateDomainData);

module.exports = router;
