const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const InquiryData = require("../models/Inquiry_data.js");
const Data = require("../models/Data.js");
const logger = require("../config/logger.js");

//@desc Test Inquiry Data API
//@route GET /api/v1/inquirydata
//@access Private: Login Required
const testUserAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/inquiry/data | User: ${user.name} | responnded with "Inquiry Data API Test Successfully" `
    );
    return res.status(200).send("Inquiry Data API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Inquiry Data
//@route GET /api/v1/inquiry/data/add
//@access Private: Login Required
const createData = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/inquiry/data/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldData = await InquiryData.findOne({
      email: data.email,
      category: data.category,
    });
    if (oldData) {
      logger.error(
        `${ip}: API /api/v1/inquiry/data/add | User: ${user.name} | responnded with Data already Exists! for Data: ${data.email} `
      );
      return res.status(400).json({ message: "Data already Exists!" });
    }
    if (data.inquired_event_name.length == 0) {
      logger.error(
        `${ip}: API /api/v1/inquiry/data/add | User: ${user.name} | responnded with Data already Exists! for Data: ${data.email} `
      );
      return res.status(401).json({ message: "Enter Inquiry Event Name!" });
    }
    if (data.exhibitor_type == 1) {
      data.exhibitor_type = "";
    }

    await InquiryData.create({
      company_name: data.company_name,
      website: data.website,
      email: data.email,
      category: data.category,
      status: data.status,
      country: data.country,
      region: data.region,
      inquired_event_name: data.inquired_event_name,
      consultant_name: data.consultant_name,
      inquiry_type: data.inquiry_type,
      inq_for: data.inq_for,
      exhi_for: data.exhi_for,
      inquiry_source: data.inquiry_source,
      inquiry_date: data.inquiry_date,
      exhibitor_date: data.exhibitor_date,
      contact_person: data.contact_person,
      designation: data.designation,
      products: data.products,
      tel: data.tel,
      mobile: data.mobile,
      city: data.city,
      address: data.address,
      exhibitor_type: data.exhibitor_type,
      comment: data.comment,
      comment1: data.comment1,
      user: data.user,
    })
      .then((data) => {
        logger.info(
          `${ip}: API /api/v1/inquiry/data/add | User: ${user.name} | responnded with Success `
        );
        return res
          .status(201)
          .json({ data, message: "Inquriy Data Added Successfully" });
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/inquiry/data/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc update inquiry Data by data id
//@route put /api/v1/inquiry/data/update/:id
//@access private: login required
const updateData = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const {
    company_name,
    website,
    email,
    category,
    status,
    country,
    region,
    inquired_event_name,
    consultant_name,
    inquiry_type,
    inq_for,
    exhi_for,
    inquiry_source,
    inquiry_date,
    exhibitor_date,
    contact_person,
    designation,
    products,
    tel,
    mobile,
    city,
    address,
    exhibitor_type,
    comment,
    comment1,
  } = req.body;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/update/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updateddata = {
      company_name,
      website,
      email,
      category,
      status,
      country,
      region,
      inquired_event_name,
      consultant_name,
      inquiry_type,
      inq_for,
      exhi_for,
      inquiry_source,
      inquiry_date,
      exhibitor_date,
      contact_person,
      designation,
      products,
      tel,
      mobile,
      city,
      address,
      exhibitor_type,
      comment,
      comment1,
      updateDate: Date.now(),
    };
    const olddata = await InquiryData.findOne({ _id: id });
    if (olddata) {
      const result = await InquiryData.findByIdAndUpdate(id, updateddata, {
        new: true,
      });
      logger.info(
        `${ip}: API /api/v1/inquiry/data/update/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return res
        .status(201)
        .json({ data: result, message: "Inquiry Data Updated Successfully" });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/update/:${id} | User: ${loggedin_user.name} | responnded with User Not Found `
      );
      return res.status(200).json({ message: "Inquiry Data Not Found" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/update/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Approve by data id
//@route GET /api/v1/data/approve/:id
//@access private: login required
const approveData = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const dataId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/data/approve/:id responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const updatedData = {
    approved: true,
  };

  const result = await Data.findByIdAndUpdate(dataId, updatedData, {
    new: true,
  });
  logger.info(
    `${ip}: API /api/v1/data/approve/:id | User: ${user.name} | Data with Id:${dataId} Updated`
  );
  return res.status(200).json({ result, message: "Data Approved." });
};

//@desc Get all inquiry Data
//@route POST /api/v1/inquiry/data/getall
//@access Private: login required
const getAllData = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const all_data = await InquiryData.find({
      active: true,
    })
      .populate("user")
      .populate("inquired_event_name")
      .populate("consultant_name")
      .sort({ createDate: -1 });
    logger.info(
      `${ip}: API /api/v1/inquiry/data/getall | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: all_data,
      message: "Inquiry Data retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/getall | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get inquiry Data by id
//@route GET /api/v1/inquiry/data/get/:id
//@access private: login required
const getDataById = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;
    const data = await InquiryData.find({
      _id: id,
    }).populate("user");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Inquiry Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Inquiry Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by Link id
//@route GET /api/v1/data/get/link/:id
//@access private: login required
const getDataByLinkId = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;
    const data = await Data.find({
      link: id,
      user: loggedin_user._id,
    })
      .populate("user")
      .populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/get/link/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/get/link/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/link/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by user id
//@route GET /api/v1/data/user/get
//@access private: login required
const getDataByUserId = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const data = await Data.find({
      user: loggedin_user._id,
    })
      .populate("user")
      .populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/user/get | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/user/get | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/user/get | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get inquiry Data by created date
//@route GET /api/v1/inquiry/data/date/get/
//@access private: login required
const getDataByCreatedDate = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const { startDate, endDate } = req.body;

  if (loggedin_user) {
    const data = await InquiryData.find({
      createDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("user");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/date/get/ | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Inquiry Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/date/get/ | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/date/get/ | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by created date and link
//@route GET /api/v1/data/date/link/get/
//@access private: login required
const getDataByCreatedDate_link = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const { startDate, endDate, link_id } = req.body;

  if (loggedin_user) {
    const data = await Data.find({
      createDate: {
        $gte: startDate,
        $lte: endDate,
      },
      link: link_id,
    })
      .populate("user")
      .populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/date/link/get/ | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/date/link/get/ | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/date/link/get/ | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by generalise filter
//@route GET /api/v1/data/generalise/get
//@access private: login required
const getDataByGeneraliseFilter = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const { firstvar, secondvar, sq1, sq2 } = req.body;
  console.log(firstvar);
  console.log(secondvar);
  console.log(sq1);
  console.log(sq2);

  if (loggedin_user) {
    const query = {};
    query[firstvar] = sq1;
    query[secondvar] = sq2;
    const data = await Data.find(query).populate("user").populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/generalise/get | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/generalise/get | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/generalise/get | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get inq Data by email and cat
//@route POST /api/v1/inquiry/data/get/byemail
//@access private: login required
const getDataByEmail = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email, category } = req.body;
  if (loggedin_user) {
    const data = await InquiryData.find({
      email,
      category: { $regex: new RegExp(`.*${category}.*`, "i") },
    }).populate("user");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/byemail | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/byemail | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/get/byemail | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get inq Data by email
//@route POST /api/v1/inquiry/data/get/byemail/1
//@access private: login required
const getDataByEmail_1 = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email } = req.body;
  if (loggedin_user) {
    const data = await InquiryData.find({
      email,
    }).populate("user");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/byemail/1 | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/get/byemail/1 | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/get/byemail/1 | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc filter inq Data
//@route POST /api/v1/inquiry/data/filter
//@access private: login required
const getFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const {
    event_name,
    website,
    email,
    category,
    status,
    country,
    region,
    products,
    created_from,
    created_to,
    company_name,
    inquiry_type,
    inq_for,
    keyword,
  } = req.body;

  if (loggedin_user) {
    const filterQuery = {};

    if (event_name != "0") {
      filterQuery.inquired_event_name = { $in: event_name };
    }

    if (company_name) {
      filterQuery.company_name = {
        $regex: new RegExp(`.*${company_name}.*`, "i"),
      };
    }

    if (website) {
      filterQuery.website = { $regex: new RegExp(`.*${website}.*`, "i") };
    }

    if (email) {
      filterQuery.email = { $regex: new RegExp(`.*${email}.*`, "i") };
    }

    if (category != "1") {
      filterQuery.category = { $regex: new RegExp(`.*${category}.*`, "i") };
    }

    if (status != "1") {
      filterQuery.status = status;
    }

    if (country != "1") {
      filterQuery.country = country;
    }

    if (region) {
      filterQuery.region = region;
    }

    if (products) {
      filterQuery.products = { $regex: new RegExp(`.*${products}.*`, "i") };
    }

    if (created_from && created_to) {
      filterQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (inquiry_type != "1") {
      filterQuery.inquiry_type = inquiry_type;
    }

    if (inq_for != "1") {
      filterQuery.inq_for = {
        $regex: new RegExp(`.*${inq_for}.*`, "i"),
      };
    }

    if (keyword) {
      //console.log("keyword");
      //console.log(keyword);
      const keywordRegex = new RegExp(`.*${keyword}.*`, "i");
      const keywordFields = [
        "company_name",
        "website",
        "email",
        "category",
        "status",
        "country",
        "region",
        "designation",
        "products",
        "contact_person",
        "mobile",
        "tel",
        "city",
        "exhibitor_type",
        "address",
        "comment",
        "comment1",
        "inquiry_type",
        "inq_for",
        "exhi_for",
        "inquiry_source",
      ];
      const orQuery = keywordFields.map((field) => ({ [field]: keywordRegex }));
      filterQuery.$or = orQuery;
    }

    if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      filterQuery.user = loggedin_user._id; //User Specific
    }

    console.log(filterQuery);
    const no_of_keys = Object.keys(filterQuery).length;

    let filteredData = [];
    if (no_of_keys > 0) {
      filteredData = await InquiryData.find(filterQuery)
        .populate("inquired_event_name")
        .populate("consultant_name")
        .populate("user");
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by email and link id
//@route POST /api/v1/inquiry/data/get/byeventid
//@access private: login required
const getDataByEventID = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { event_id } = req.body;
  if (loggedin_user) {
    const data = await InquiryData.find({
      inquired_event_name: {
        $elemMatch: { $eq: event_id },
      },
    })
      .populate("inquired_event_name")
      .populate("user");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/get/bylinkid/ | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/get/bylinkid | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/bylinkid | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by check email domain
//@route POST /api/v1/inquiry/data/check/email/domain
//@access private: login required
const checkEmailDomain = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email } = req.body;
  const domain = email.split("@")[1];
  console.log(domain);
  if (loggedin_user) {
    const data = await InquiryData.find({
      email: { $regex: new RegExp(domain, "i") },
    })
      .populate("inquired_event_name")
      .populate("user")
      .sort({ updateDate: -1 });

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/check/email/domain | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/inquiry/data/check/email/domain | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/check/email/domain | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

/* const getCombinedFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const {
    event_name,
    website,
    email,
    category,
    status,
    country,
    region,
    products,
    created_from,
    created_to,
    company_name,
    inquiry_type,
    inq_for,
    keyword,
    link_value,
    data_type,
    designation,
    approved_type,
    user,
  } = req.body;

  if (loggedin_user) {
    try {
      // Define the aggregation pipeline stages
      const pipeline = [];

      // Match stage to filter based on provided criteria
      const matchCriteria = {};
      if (event_name) matchCriteria.inquired_event_name = event_name;
      if (website) matchCriteria.website = website;
      if (email) matchCriteria.email = email;
      if (category) matchCriteria.category = category;
      if (status) matchCriteria.status = status;
      if (country) matchCriteria.country = country;
      if (region) matchCriteria.region = region;
      if (products) matchCriteria.products = products;
      if (created_from || created_to) {
        matchCriteria.createDate = {};
        if (created_from)
          matchCriteria.createDate.$gte = new Date(created_from);
        if (created_to) matchCriteria.createDate.$lte = new Date(created_to);
      }
      if (company_name) matchCriteria.company_name = company_name;
      if (inquiry_type) matchCriteria.inquiry_type = inquiry_type;
      if (inq_for) matchCriteria.inq_for = inq_for;
      if (keyword) {
        matchCriteria.$or = [
          { company_name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { products: { $regex: keyword, $options: "i" } },
          { contact_person: { $regex: keyword, $options: "i" } },
          { designation: { $regex: keyword, $options: "i" } },
          { comment: { $regex: keyword, $options: "i" } },
          { comment1: { $regex: keyword, $options: "i" } },
        ];
      }
      if (link_value) matchCriteria.link = link_value;
      if (data_type) matchCriteria.active = data_type === "active";
      if (designation) matchCriteria.designation = designation;
      if (approved_type !== undefined)
        matchCriteria.approved = approved_type === "approved";
      if (user) matchCriteria.user = user;

      pipeline.push({ $match: matchCriteria });

      // Add lookup stage to fetch related data from both collections
      pipeline.push({
        $lookup: {
          from: "inquirydatas",
          let: { dataUserId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$dataUserId"] },
              },
            },
          ],
          as: "inquiryData",
        },
      });

      // Add project stage to prioritize inquiryData if it exists
      pipeline.push({
        $project: {
          mergedData: { $concatArrays: ["$inquiryData", ["$ROOT"]] },
        },
      });

      // Add unwind and replaceRoot stages to flatten the result
      pipeline.push({ $unwind: "$mergedData" });
      pipeline.push({ $replaceRoot: { newRoot: "$mergedData" } });

      // Execute the aggregation pipeline
      const results = await Data.aggregate(pipeline);

      // Send the filtered results in the response
      res.status(200).json(results);
    } catch (error) {
      console.error("Error in checkEmailDomain:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/inquiry/data/check/email/domain | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    res.status(401).send({ message: "User is not Autherized" });
  }
}; */

const getCombinedFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const {
    event_name,
    website,
    email,
    category,
    status,
    country,
    region,
    products,
    created_from,
    created_to,
    company_name,
    inquiry_type,
    inq_for,
    exhi_for,
    keyword,
    link_value,
    data_type,
    designation,
    approved_type,
    user,
  } = req.body;
  console.log(status);
  /* console.log(
    event_name,
    website,
    email,
    category,
    status,
    country,
    region,
    products,
    created_from,
    created_to,
    company_name,
    inquiry_type,
    inq_for,
    exhi_for,
    keyword,
    link_value,
    data_type,
    designation,
    approved_type,
    user
  ); */
  if (loggedin_user) {
    // Filter Data

    const filterDataQuery = {};

    if (link_value != "0") {
      filterDataQuery.link = link_value;
    }

    if (data_type == "new_data" && link_value != "0") {
      filterDataQuery["link.0"] = link_value;
    } else if (data_type == "old_data" && link_value != "0") {
      filterDataQuery["link.0"] = { $ne: link_value };
      filterDataQuery.link = { $elemMatch: { $eq: link_value } };
    } else if (data_type == "both" && link_value != "0") {
      filterDataQuery.link = { $elemMatch: { $eq: link_value } };
    }

    if (company_name) {
      filterDataQuery.company_name = {
        $regex: new RegExp(`.*${company_name}.*`, "i"),
      };
    }

    if (website) {
      filterDataQuery.website = { $regex: new RegExp(`.*${website}.*`, "i") };
    }

    if (email) {
      filterDataQuery.email = { $regex: new RegExp(`.*${email}.*`, "i") };
    }

    if (category != "1") {
      filterDataQuery.category = { $regex: new RegExp(`.*${category}.*`, "i") };
    }

    if (status != "1") {
      filterDataQuery.status = status;
    } else if (status == "1") {
      filterDataQuery.status = { $ne: "Removes" };
    }

    if (country != "1") {
      filterDataQuery.country = country;
    }

    if (region) {
      filterDataQuery.region = region;
    }

    if (designation) {
      filterDataQuery.designation = designation;
    }

    if (products) {
      filterDataQuery.products = { $regex: new RegExp(`.*${products}.*`, "i") };
    }

    if (created_from && created_to) {
      filterDataQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (approved_type != "1") {
      filterDataQuery.approved = approved_type;
    }

    if (user != "0") {
      filterDataQuery.user = user;
    }

    if (keyword) {
      const keywordRegex = new RegExp(`.*${keyword}.*`, "i");
      const keywordFields = [
        "company_name",
        "website",
        "email",
        "category",
        "status",
        "country",
        "region",
        "designation",
        "products",
        "contact_person",
        "mobile",
        "tel",
        "city",
        "exhibitor_type",
        "address",
        "comment",
        "comment1",
      ];
      const orQuery = keywordFields.map((field) => ({ [field]: keywordRegex }));
      filterDataQuery.$or = orQuery;
    }

    /* console.log("filterDataQuery:");
    console.log(filterDataQuery); */
    const no_of_keys = Object.keys(filterDataQuery).length;

    let filteredData = [];
    if (no_of_keys > 1) {
      filteredData = await Data.find(filterDataQuery)
        .populate("link")
        .populate("user")
        .populate("update_user");
    }
    console.log("Filter Data: ");
    console.log(filteredData.length);
    /*  if (filteredData.length > 0) {
     
    } */

    // Filter Inquiry Data

    const filterInqQuery = {};

    if (event_name != "0") {
      filterInqQuery.inquired_event_name = { $in: event_name };
    }

    if (company_name) {
      filterInqQuery.company_name = {
        $regex: new RegExp(`.*${company_name}.*`, "i"),
      };
    }

    if (website) {
      filterInqQuery.website = { $regex: new RegExp(`.*${website}.*`, "i") };
    }

    if (email) {
      filterInqQuery.email = { $regex: new RegExp(`.*${email}.*`, "i") };
    }

    if (category != "1") {
      filterInqQuery.category = { $regex: new RegExp(`.*${category}.*`, "i") };
    }

    if (status != "1") {
      filterInqQuery.status = status;
    }

    if (country != "1") {
      filterInqQuery.country = country;
    }

    if (region) {
      filterInqQuery.region = region;
    }

    if (products) {
      filterInqQuery.products = { $regex: new RegExp(`.*${products}.*`, "i") };
    }

    if (created_from && created_to) {
      filterInqQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (inquiry_type != "1") {
      filterInqQuery.inquiry_type = inquiry_type;
    }

    if (inq_for) {
      filterInqQuery.inq_for = {
        $regex: new RegExp(`.*${inq_for}.*`, "i"),
      };
    }

    if (exhi_for) {
      filterInqQuery.exhi_for = {
        $regex: new RegExp(`.*${exhi_for}.*`, "i"),
      };
    }

    if (keyword) {
      const keywordRegex = new RegExp(`.*${keyword}.*`, "i");
      const keywordFields = [
        "company_name",
        "website",
        "email",
        "category",
        "status",
        "country",
        "region",
        "designation",
        "products",
        "contact_person",
        "mobile",
        "tel",
        "city",
        "exhibitor_type",
        "address",
        "comment",
        "comment1",
        "inquiry_type",
        "inq_for",
        "exhi_for",
        "inquiry_source",
      ];
      const orQuery = keywordFields.map((field) => ({ [field]: keywordRegex }));
      filterInqQuery.$or = orQuery;
    }

    if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      filterInqQuery.user = loggedin_user._id; //User Specific
    }

    /* console.log("filterInqQuery: ");
    console.log(filterInqQuery); */
    const no_of_keys_inq = Object.keys(filterInqQuery).length;

    let filteredInqData = [];
    if (no_of_keys_inq > 0) {
      filteredInqData = await InquiryData.find(filterInqQuery)
        .populate("inquired_event_name")
        .populate("consultant_name")
        .populate("user");
    }

    console.log("Filter Inquiry Data:");
    console.log(filteredInqData.length);
    /*  if (filteredInqData.length > 0) {
      
    } */
    const finalData = [];

    // Merge data based on email field
    filteredData.forEach((data1) => {
      let data2 = filteredInqData.find((data) => {
        return data.email === data1.email;
      });

      if (data2) {
        finalData.push({ ...data2 });
      } else {
        finalData.push(data1);
      }
    });

    // Extract only the _doc field from finalData
    const filteredFinalData = finalData.map((item) => item._doc);
    // Add remaining data from filteredInqData

    filteredInqData.forEach((data) => {
      /* console.log(
          !filteredFinalData.some((item) => {
            console.log("item: ", item.email);
            console.log("data: ", data.email);
            item.email === data.email;
          })
        ); */
      if (!filteredFinalData.some((item) => item.email === data.email)) {
        /* console.log("in Data");
          console.log(data); */
        filteredFinalData.push(data);
      }
    });

    if (filteredFinalData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/master/data/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredFinalData,
        data_len: filteredFinalData.length,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/master/data/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
        data: [],
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/master/data/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
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
};
