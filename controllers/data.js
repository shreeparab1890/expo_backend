const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const Data = require("../models/Data");
const User = require("../models/User.js");
const Link = require("../models/Link.js");
const Inquiry_data = require("../models/Inquiry_data.js");
const logger = require("../config/logger.js");
var axios = require("axios");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
const testUserAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/data | User: ${user.name} | responnded with "Data API Test Successfully" `
    );
    return res.status(200).send("Data API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/data | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc verify whatsapp number
//@route GET /api/v1/data/verify/whatsapp
//@access Private: Login Required
const verifyWhatsappNumber = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  var config = {
    method: "get",
    url: "https://api.p.2chat.io/open/whatsapp/check-number/+919923826906/+917498164417",
    headers: {
      "X-User-API-Key": "UAK7d2b8687-35a7-473c-93e1-24047989edfc",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return res.status(200).send({ data: response.data });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(401).send("Data API Test Successfully");
    });
};

//@desc Create New Data
//@route GET /api/v1/data/add
//@access Private: Login Required
const createData = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/data/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    //const oldData = await Data.findOne({ email: data.email, link: data.link });
    const oldData = await Data.findOne({ email: data.email });
    if (oldData) {
      logger.error(
        `${ip}: API /api/v1/data/add | User: ${user.name} | responnded with Data already Exists! for Data: ${data.email} `
      );
      return res.status(400).json({ message: "Data already Exists!" });
    }

    await Data.create({
      company_name: data.company_name,
      website: data.website,
      email: data.email,
      category: data.category,
      status: data.status,
      country: data.country,
      region: data.region,
      contact_person: data.contact_person,
      designation: data.designation,
      products: data.products,
      tel: data.tel,
      mobile: data.mobile,
      whatsApp: data.whatsApp,
      city: data.city,
      address: data.address,
      exhibitor_type: data.exhibitor_type,
      comment: data.comment,
      comment1: data.comment1,
      user: data.user,
      link: data.link,
      source_user: user._id,
      pooledOldData: data.pooledOldData,
    })
      .then((link) => {
        logger.info(
          `${ip}: API /api/v1/data/add | User: ${user.name} | responnded with Success `
        );
        return res
          .status(201)
          .json({ link, message: "Data Added Successfully" });
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/data/add | User: ${user.name} | responnded with Error `
        );
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(400).send({ message: "User is not Autherized" });
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
    approving_user: user._id,
  };

  const result = await Data.findByIdAndUpdate(dataId, updatedData, {
    new: true,
  });
  logger.info(
    `${ip}: API /api/v1/data/approve/:id | User: ${user.name} | Data with Id:${dataId} Updated`
  );
  return res.status(200).json({ result, message: "Data Approved." });
};

//@desc bulk Approve by data id
//@route post /api/v1/data/bulk/approve/:id
//@access private: login required
const bulkApproveData = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/data/bulk/approve/:id responnded with Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const { dataIds } = data;

  if (!dataIds || !Array.isArray(dataIds) || dataIds.length === 0) {
    logger.error(
      `${ip}: API /api/v1/data/bulk/approve/:id Invalid or missing dataIds `
    );
    return res.status(400).json({ message: "Invalid or missing dataIds" });
  }
  const updatedData = {
    approved: true,
    approving_user: user._id,
  };
  //console.log(dataIds);
  const results = await Promise.all(
    dataIds.map(async (dataId) => {
      const result = await Data.findByIdAndUpdate(dataId, updatedData, {
        new: true,
      });

      logger.info(
        `${ip}: API /api/v1/data/bulk/approve/:id | User: ${user.name} | Data with Id:${dataId} Updated`
      );

      return result;
    })
  );

  return res.status(200).json({ results, message: "Bulk Data Approved." });

  /* const result = await Data.findByIdAndUpdate(dataId, updatedData, {
    new: true,
  });
  logger.info(
    `${ip}: API /api/v1/data/approve/:id | User: ${user.name} | Data with Id:${dataId} Updated`
  );
  return res.status(200).json({ result, message: "Data Approved." }); */
};

//@desc Get all Data
//@route POST /api/v1/data/getall
//@access Private: login required
const getAllData = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const all_data = await Data.find({
      active: true,
    })
      .populate("user")
      .populate("link");
    logger.info(
      `${ip}: API /api/v1/data/getall | User: ${user.name} | responnded with Success `
    );
    //console.log(all_data);
    return await res.status(200).json({
      data: all_data,
      message: "Data retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/getall | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by id
//@route GET /api/v1/data/get/:id
//@access private: login required
const getDataById = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;
    const data = await Data.find({
      _id: id,
    })
      .populate("user")
      .populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
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
      //link: id,
      approved: false,
      "link.0": id,
    })
      .populate("user")
      .populate("update_user")
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

//@desc Get Data by Link id
//@route GET /api/v1/data/get/link/user/:id
//@access private: login required
const getDataByLinkId_user = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;
    /* const data = await Data.find({
      link: id,
      user: loggedin_user._id,
    }) */
    const data = await Data.find({
      $or: [
        { link: id, user: loggedin_user._id },
        { link: id, update_user: loggedin_user._id },
      ],
    })
      .sort({ createDate: -1 })
      .populate("user")
      .populate("update_user")
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

//@desc update Data by data id
//@route put /api/v1/data/update/:id
//@access private: login required
const updateData = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const {
    link,
    company_name,
    website,
    email,
    category,
    status,
    country,
    region,
    contact_person,
    designation,
    products,
    tel,
    mobile,
    whatsApp,
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
      `${ip}: API /api/v1/data/update/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const olddata = await Data.findOne({ _id: id });
    let updateddata;
    if (link == "") {
      updateddata = {
        company_name,
        website,
        email,
        category,
        status,
        country,
        region,
        contact_person,
        designation,
        products,
        tel,
        mobile,
        whatsApp,
        city,
        address,
        exhibitor_type,
        comment,
        comment1,
        UpdatedDate: Date.now(),
        update_user: [...new Set([...olddata.update_user, loggedin_user._id])],
      };
    } else {
      updateddata = {
        company_name,
        website,
        email,
        category,
        status,
        country,
        region,
        contact_person,
        designation,
        products,
        tel,
        mobile,
        whatsApp,
        city,
        address,
        exhibitor_type,
        comment,
        comment1,
        UpdatedDate: Date.now(),
        update_user: [...new Set([...olddata.update_user, loggedin_user._id])],
        link: [...new Set([...olddata.link, link])],
      };
    }

    if (olddata) {
      const result = await Data.findByIdAndUpdate(id, updateddata, {
        new: true,
      });
      logger.info(
        `${ip}: API /api/v1/data/update/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return res
        .status(200)
        .json({ data: result, message: "Data Updated Successfully" });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/update/:${id} | User: ${loggedin_user.name} | responnded with User Not Found `
      );
      return res.status(200).json({ message: "Data Not Found" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/data/update/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
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
      //$or: [{ user: loggedin_user._id }, { update_user: loggedin_user._id }],
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

//@desc Get Data by created date
//@route GET /api/v1/data/date/get/
//@access private: login required
const getDataByCreatedDate = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const { startDate, endDate } = req.body;

  if (loggedin_user) {
    const data = await Data.find({
      createDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("user")
      .populate("link");
    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/date/get/ | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/date/get/ | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/date/get/ | User: ${loggedin_user.name} | responnded with User is not Autherized `
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

//@desc filter Data
//@route GET /api/v1/data/filter
//@access private: login required
const getFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const {
    link_value,
    website,
    email,
    category,
    status,
    country,
    region,
    designation,
    products,
    created_from,
    created_to,
    approved_type,
    user,
    company_name,
    created_today,
  } = req.body;

  if (loggedin_user) {
    /* console.log(
      link_value,
      email,
      category,
      status,
      country,
      region,
      designation,
      products,
      created_from,
      created_to,
      approved_type
    ); */
    const filterQuery = {};

    if (link_value != "0") {
      filterQuery.link = link_value;
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
    } else if (status == "1") {
      filterQuery.status = { $ne: "Removes" };
    }

    if (country != "1") {
      filterQuery.country = country;
    }

    if (region != "1") {
      filterQuery.region = region;
    }

    if (designation) {
      filterQuery.designation = designation;
    }

    if (products) {
      filterQuery.products = { $regex: new RegExp(`.*${products}.*`, "i") };
    }

    if (created_today) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filterQuery.createDate = {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (created_from && created_to) {
      filterQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (approved_type != "1") {
      filterQuery.approved = approved_type;
    }

    /*  if (data_type != "1") {
      filterQuery["link.0"] = { $exists: true };
    } */

    /*  if (user != "0") {
      filterQuery.user = user;
    } */

    if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      //filterQuery.user = loggedin_user._id; //User Specific
      filterQuery.$or = [
        { user: loggedin_user._id },
        { update_user: loggedin_user._id },
      ];
    }

    const no_of_keys = Object.keys(filterQuery).length;
    console.log(filterQuery);
    let filteredData = [];
    if (no_of_keys >= 1) {
      filteredData = await Data.find(filterQuery)
        .populate("link")
        .populate("user");
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
        data: [],
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc retrive filter Data
//@route POST /api/v1/data/retrive/filter
//@access private: login required
const getRetriveFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const {
    link_value,
    data_type,
    company_name,
    website,
    email,
    category,
    status,
    country,
    region,
    designation,
    products,
    created_from,
    created_to,
    approved_type,
    user,
    keyword,
  } = req.body;

  if (loggedin_user) {
    const filterQuery = {};

    /*  if (link_value) {
      filterQuery.link = {};
      filterQuery.link.$elemMatch = { value: link_value };
    } */
    if (link_value != "0") {
      filterQuery.link = link_value;
    }

    if (data_type == "new_data" && link_value != "0") {
      filterQuery["link.0"] = link_value;
    } else if (data_type == "old_data" && link_value != "0") {
      filterQuery["link.0"] = { $ne: link_value };
      filterQuery.link = { $elemMatch: { $eq: link_value } };
    } else if (data_type == "both" && link_value != "0") {
      filterQuery.link = { $elemMatch: { $eq: link_value } };
    }

    /* if (link_name != "") {
      filterQuery["link.name"] = {
        $elemMatch: { $regex: new RegExp(`.*${link_name}.*`, "i") },
      };
    } */

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
    } else if (status == "1") {
      filterQuery.status = { $ne: "Removes" };
    }

    if (country != "1") {
      filterQuery.country = country;
    }

    if (region != "1") {
      filterQuery.region = region;
    }

    if (designation) {
      filterQuery.designation = designation;
    }

    if (products) {
      filterQuery.products = { $regex: new RegExp(`.*${products}.*`, "i") };
    }

    if (created_from && created_to) {
      filterQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (approved_type != "1") {
      filterQuery.approved = approved_type;
    }

    if (user != "0") {
      filterQuery.user = user;
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
      ];
      const orQuery = keywordFields.map((field) => ({ [field]: keywordRegex }));
      filterQuery.$or = orQuery;
    }

    /*  if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      filterQuery.user = loggedin_user._id; //User Specific
    } */
    console.log(filterQuery);
    const no_of_keys = Object.keys(filterQuery).length;

    let filteredData = [];
    if (no_of_keys >= 1) {
      filteredData = await Data.find(filterQuery)
        .populate("link")
        .populate("user")
        .populate("update_user");
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/retrive/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/retrive/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/retrive/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by email and link id
//@route POST /api/v1/data/get/byemail
//@access private: login required
const getDataByEmail_LinkID = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { link_id, email, link_value } = req.body;
  if (loggedin_user) {
    const data = await Data.find({
      //link: link_id,
      email,
    })
      .populate("user")
      .populate("link");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/get/byemail/ | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/get/byemail | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/byemail | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by email and link id
//@route POST /api/v1/data/get/bylinkid
//@access private: login required
const getDataByLinkID = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { link_id } = req.body;
  if (loggedin_user) {
    const data = await Data.find({
      link: {
        $elemMatch: { $eq: link_id },
      },
    })
      .populate("user")
      .populate("link");

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

//@desc Get Data by email and category
//@route POST /api/v1/data/get/byemail/cat
//@access private: login required
const getDataByEmail = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email, category } = req.body;

  if (loggedin_user) {
    const data = await Data.find({
      //category: { $regex: new RegExp(category, "i") },
      email,
    })
      .populate("user")
      .populate("link");

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/get/byemail1/ | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/get/byemail | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/byemail | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add data leader board
//@route get /api/v1/data/get/leader
//@access private: login required
const getDataLeaderboard = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add data leader board
//@route get /api/v1/data/get/approved/leader
//@access private: login required
const getApprovedDataLeader = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const leaderboard = await Data.aggregate([
      { $match: { approving_user: { $ne: null } } }, // Filter documents with non-null approving_user
      {
        $group: {
          _id: "$approving_user", // Group by approving_user
          count: { $sum: 1 }, // Count the number of documents for each approving_user
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
      {
        $lookup: {
          from: "users", // Assuming your users collection is named "users"
          localField: "_id",
          foreignField: "_id",
          as: "user_info",
        },
      },
      { $unwind: "$user_info" }, // Unwind the array created by $lookup
      {
        $project: {
          _id: 0, // Exclude the default _id field
          user: "$user_info.name", // Get the username of the user
          count: 1, // Include the count field
        },
      },
    ]);

    return res.status(201).send({ leaderboard });
    /* const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "approving_user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: { "datas.approved": true },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      }); */
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add data leader board
//@route get /api/v1/link/get/data/leader/new
//@access private: login required
/* const getNewDataLeaderboard = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
}; */

//@desc get add add leader board
//@route post /api/v1/link/get/leader/today
//@access private: login required
const getDataLeaderToday = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: todayStart,
            $lte: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add add leader board
//@route post /api/v1/link/get/leader/yesterday
//@access private: login required
const getDataLeaderYesterday = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    /*  console.log(yesterdayStart.toLocaleString()); */

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add add leader board
//@route post /api/v1/link/get/leader/thisweek
//@access private: login required
const getDataLeaderThisWeek = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(diff);
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    thisWeekEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: thisWeekStart,
            $lte: thisWeekEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add add leader board
//@route post /api/v1/link/get/leader/lastweek
//@access private: login required
const getDataLeaderLastWeek = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay - 7;

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(diff);
    lastWeekStart.setHours(0, 0, 0, 0);

    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
    lastWeekEnd.setHours(23, 59, 59, 999);

    console.log(lastWeekStart, lastWeekEnd);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: lastWeekStart,
            $lte: lastWeekEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add add leader board
//@route post /api/v1/link/get/leader/thismonth
//@access private: login required
const getDataLeaderThisMonth = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const thisMonthStart = new Date(today);
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const nextMonthStart = new Date(today);
    nextMonthStart.setMonth(today.getMonth() + 1, 1);
    nextMonthStart.setHours(0, 0, 0, 0);

    const thisMonthEnd = new Date(nextMonthStart);
    thisMonthEnd.setDate(nextMonthStart.getDate() - 1);
    thisMonthEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: thisMonthStart,
            $lte: thisMonthEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add add leader board
//@route post /api/v1/link/get/leader/lastmonth
//@access private: login required
const getDataLeaderLastMonth = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const today = new Date();

    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(today.getMonth() - 1, 1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const firstDayOfThisMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const lastMonthEnd = new Date(firstDayOfThisMonth);
    lastMonthEnd.setDate(firstDayOfThisMonth.getDate() - 1);
    lastMonthEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "datas",
          localField: "_id",
          foreignField: "user",
          as: "datas",
        },
      },
      {
        $unwind: "$datas",
      },
      {
        $match: {
          "datas.createDate": {
            $gte: lastMonthStart,
            $lte: lastMonthEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          dataCount: { $sum: 1 },
        },
      },
      {
        $sort: { dataCount: -1 },
      },
      {
        $limit: 50,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/data/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get new or old data
//@route POST /api/v1/data/new/filter
//@access private: login required
const getNewData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { givenLink, data_type, created_from, created_to } = req.body;

    let filteredData = [];
    let filteredData1 = [];
    let combinedFilteredData = [];
    if ((created_from != "" && created_to) != "") {
      if (
        loggedin_user.roleType != "super_admin" &&
        loggedin_user.roleType != "admin"
      ) {
        if (data_type == "new_data") {
          filteredData = await Data.find({
            "link.0": givenLink,
            user: loggedin_user._id,
            /* $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: loggedin_user._id,
              },
            ], */
            createDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "old_data") {
          filteredData = await Data.find({
            "link.0": { $ne: givenLink },
            link: {
              $elemMatch: { $eq: givenLink },
            },
            //pooledOldData: true,
            //update_user: loggedin_user._id,
            update_user: { $in: loggedin_user._id },

            /* $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: loggedin_user._id,
              },
            ], */
            UpdatedDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "both") {
          filteredData = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
            //user: loggedin_user._id,
            $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: { $in: loggedin_user._id },
              },
            ],
            createDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
          filteredData1 = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
            user: loggedin_user._id,
            UpdatedDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
          filteredData = filteredData.concat(filteredData1);
          let uniqueMap = new Map();
          filteredData.forEach((obj) => {
            uniqueMap.set(JSON.stringify(obj), obj);
          });
          let uniqueObjects = Array.from(uniqueMap.values());
          //console.log(uniqueObjects);
          filteredData = uniqueObjects;
        }
      } else {
        if (data_type == "new_data") {
          filteredData = await Data.find({
            "link.0": givenLink,
            createDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "old_data") {
          filteredData = await Data.find({
            "link.0": { $ne: givenLink },
            link: {
              $elemMatch: { $eq: givenLink },
            },
            //pooledOldData: true,
            UpdatedDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "both") {
          filteredData = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
            createDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
          filteredData1 = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
            UpdatedDate: { $gte: created_from, $lte: created_to },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");

          filteredData = filteredData.concat(filteredData1);
          let uniqueMap = new Map();
          filteredData.forEach((obj) => {
            uniqueMap.set(JSON.stringify(obj), obj);
          });
          let uniqueObjects = Array.from(uniqueMap.values());
          //console.log(uniqueObjects);
          filteredData = uniqueObjects;
        }
      }
    } else {
      if (
        loggedin_user.roleType != "super_admin" &&
        loggedin_user.roleType != "admin"
      ) {
        if (data_type == "new_data") {
          filteredData = await Data.find({
            "link.0": givenLink,
            user: loggedin_user._id,
            /* $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: loggedin_user._id,
              },
            ], */
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "old_data") {
          filteredData = await Data.find({
            "link.0": { $ne: givenLink },
            link: {
              $elemMatch: { $eq: givenLink },
            },

            update_user: { $in: loggedin_user._id },

            /*  $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: loggedin_user._id,
              },
            ], */
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "both") {
          filteredData = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
            //user: loggedin_user._id,
            $or: [
              {
                user: loggedin_user._id,
              },
              {
                update_user: { $in: loggedin_user._id },
              },
            ],
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        }
      } else {
        if (data_type == "new_data") {
          filteredData = await Data.find({
            "link.0": givenLink,
            //pooledOldData: false,
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "old_data") {
          filteredData = await Data.find({
            /*  $or: [
              {
                "link.0": { $ne: givenLink },
                link: {
                  $elemMatch: { $eq: givenLink },
                },
              },
              { pooledOldData: true },
            ], */
            "link.0": { $ne: givenLink },
            link: {
              $elemMatch: { $eq: givenLink },
            },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        } else if (data_type == "both") {
          filteredData = await Data.find({
            link: {
              $elemMatch: { $eq: givenLink },
            },
          })
            .populate("user")
            .populate("update_user")
            .populate("link");
        }
      }
    }
    if (filteredData.length > 0) {
      //console.log(filteredData);
      return res
        .status(200)
        .send({ data: filteredData, message: "Data Retrived Successfully" });
    } else {
      return res.status(200).send({ data: [], message: "No Data Found" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/new/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Data by check email domain
//@route POST /api/v1/data/check/email/domain
//@access private: login required
const checkEmailDomain = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email } = req.body;
  const domain = email.split("@")[1];

  if (loggedin_user) {
    const data = await Data.find({
      email: { $regex: new RegExp(domain, "i") },
    })
      .populate("user")
      .populate("link")
      .sort({ updateDate: -1 });

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/check/email/domain | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/data/check/email/domain | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/data/check/email/domain | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc update status by data id
//@route GET /api/v1/data/update/status/:id
//@access private: login required
const updateStatusData = async (req, res) => {
  try {
    console.log("Here in Update Status");
    const user = req.user;
    const dataId = req.params.id;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const { link_status } = req.body;
    const updatedData = {
      status: link_status,
    };

    const result = await Data.findByIdAndUpdate(dataId, updatedData, {
      new: true,
    });
    logger.info(
      `${ip}: API /api/v1/data/update/status/:id | User: ${user.name} | Data with Id:${dataId} Updated`
    );
    return res.status(200).json({ result, message: "Data Status Updated." });
  } catch (err) {
    return res
      .status(500)
      .json({ result, message: "Error While updating Data status!" });
  }
};

//@desc update status by data id
//@route GET /api/v1/data/duplicate/check/link/:dataId/:linkId
//@access private: login required
const checkLinkDuplicate = async (req, res) => {
  try {
    const user = req.user;
    const linkID = req.params.linkId;
    const dataId = req.params.dataId;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    Data.findOne({
      _id: dataId,
      link: { $in: [linkID] },
    })
      .then((foundData) => {
        if (foundData) {
          /* console.log("Link is present in the Data document:", foundData); */
          logger.info(`${ip}: API /api/v1/data/duplicate/check/link/:id `);
          return res.status(200).json({ result: true });
        } else {
          /*  console.log("Link is not present in any Data document."); */
          logger.info(`${ip}: API /api/v1/data/duplicate/check/link/:id `);
          return res.status(200).json({ result: false });
        }
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ error, message: "Error While updating Data status!" });
      });
  } catch (err) {
    return res
      .status(500)
      .json({ err, message: "Error While updating Data status!" });
  }
};

//@desc update status by data id
//@route POST /api/v1/data/dashboard/data/type/count
//@access private: login required
const getDashboardDataTypeCount = async (req, res) => {
  try {
    const user = req.user;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { created_from, created_to } = req.body;

    if (user) {
      const data = await Data.find({
        createDate: { $gte: created_from, $lte: created_to },
      });

      if (data) {
        //get unique links linked to the created data
        let uniqueLinks = [];
        data.forEach((item) => {
          if (item.link && Array.isArray(item.link)) {
            item.link.forEach((link) => {
              if (link && !uniqueLinks.includes(link)) {
                uniqueLinks.push(link.toString());
              }
            });
          }
        });
        const uniqueLinksSet = new Set(uniqueLinks);
        const uniqueLinksArray = Array.from(uniqueLinksSet);

        let leaderboardNew = [];
        let leaderboardOld = [];
        // Get all users
        const allUsers = await User.find();

        // get new data count
        for (const currentUser of allUsers) {
          console.log(currentUser.name);
          let newDataCount = 0;
          for (const link of uniqueLinksArray) {
            const newData = await Data.find({
              "link.0": link,
              user: currentUser._id,
              createDate: { $gte: created_from, $lte: created_to },
            });
            //console.log(newData.length);
            newDataCount += newData.length;
          }
          //console.log("newDataCount: ", newDataCount);
          leaderboardNew.push({ user: currentUser.name, newDataCount });

          // get old data count
          let oldDataCount = 0;
          //console.log(uniqueLinksArray);
          for (const link of uniqueLinksArray) {
            const oldData = await Data.find({
              /*  $or: [
                {
                  "link.0": { $ne: link },
                  link: {
                    $elemMatch: { $eq: link },
                  },
                },
                { pooledOldData: true },
              ], */
              "link.0": { $ne: link },
              link: {
                $elemMatch: { $eq: link },
              },
              //update_user: currentUser._id,
              update_user: { $elemMatch: { $in: currentUser._id } },
              UpdatedDate: { $gte: created_from, $lte: created_to },
            });
            //console.log(oldData.length);
            oldDataCount += oldData.length;
          }
          //console.log("oldDataCount: ", oldDataCount);
          leaderboardOld.push({ user: currentUser.name, oldDataCount });
        }
        return res.status(200).json({
          newDataLeaderboard: leaderboardNew,
          oldDataLeaderboard: leaderboardOld,
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/data/dashboard/data/type/count | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (err) {
    return res.status(500).json({ err, message: "Error!" });
  }
};

//@desc update status by data id
//@route POST /api/v1/data/export/dashboard/data/type/count
//@access private: login required
const exportDashboardDataTypeCount = async (req, res) => {
  try {
    const user = req.user;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { created_from, created_to } = req.body;

    if (user) {
      //Get Data created in the date range given
      const data = await Data.find({
        createDate: { $gte: created_from, $lte: created_to },
      });

      if (data) {
        //get unique links linked to the created data
        let uniqueLinks = [];
        data.forEach((item) => {
          if (item.link && Array.isArray(item.link)) {
            item.link.forEach((link) => {
              if (link && !uniqueLinks.includes(link)) {
                uniqueLinks.push(link.toString());
              }
            });
          }
        });
        const uniqueLinksSet = new Set(uniqueLinks);
        const uniqueLinksArray = Array.from(uniqueLinksSet);

        let leaderboardNew = [];
        let leaderboardOld = [];
        let leaderboardOverall = [];
        let leaderboard = [];

        // Get all users
        const allUsers = await User.find({
          active: true,
          approved: true,
        });

        // get new data count
        for (const currentUser of allUsers) {
          let overallDataCount = 0;
          for (const link of uniqueLinksArray) {
            const overallData = await Data.find({
              user: currentUser._id,
              createDate: { $gte: created_from, $lte: created_to },
            });

            overallDataCount += overallData.length;
          }

          let newDataCount = 0;
          for (const link of uniqueLinksArray) {
            const newData = await Data.find({
              "link.0": link,
              user: currentUser._id,
              createDate: { $gte: created_from, $lte: created_to },
            });

            newDataCount += newData.length;
          }
          //leaderboardNew.push({ user: currentUser.name, newDataCount });

          // get old data count
          let oldDataCount = 0;
          for (const link of uniqueLinksArray) {
            const oldData = await Data.find({
              "link.0": { $ne: link },
              link: {
                $elemMatch: { $eq: link },
              },
              update_user: currentUser._id,
              UpdatedDate: { $gte: created_from, $lte: created_to },
            });

            oldDataCount += oldData.length;
          }
          //leaderboardOld.push({ user: currentUser.name, oldDataCount });
          leaderboard.push({
            Staff: currentUser.name,
            Excel_Data: newDataCount + oldDataCount,
            New_Data: newDataCount,
            Duplicates: oldDataCount,
          });
        }
        return res.status(200).json({
          data: leaderboard,
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/data/export/dashboard/data/type/count | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (err) {
    return res.status(500).json({ err, message: "Error!" });
  }
};

const getCategoryDataCount = async () => {
  try {
    const categoryCount = await Data.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    console.log(categoryCount);
    return categoryCount;
  } catch (err) {
    console.error("Error getting category data count:", err);
    throw err;
  }
};

const uploadData = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { upload_data } = req.body;
  try {
    if (user) {
      for (let i = 0; i < upload_data.length; i++) {
        console.log("Row", i + 1);
        const added_link = await Link.find({
          value: upload_data[i].link_url,
        }).populate({
          path: "assign_user.user",
        });
        //console.log(added_link);
        const oldData = await Data.findOne({ email: upload_data[i].email });
        if (!oldData) {
          //const upload_cat = upload_data[i].category.split(",").join(", ");
          const data = {
            email: upload_data[i].email,
            company_name: upload_data[i].company_name,
            website: upload_data[i].website,
            category: upload_data[i].category,
            status: upload_data[i].status,
            country: upload_data[i].country,
            region: upload_data[i].region,
            contact_person: upload_data[i].contact_person,
            designation: upload_data[i].designation,
            products: upload_data[i].products,
            tel: upload_data[i].tel,
            mobile: upload_data[i].mobile,
            whatsApp: upload_data[i].whatsApp,
            city: upload_data[i].city,
            exhibitor_type: upload_data[i].exhibitor_type,
            address: upload_data[i].address,
            comment: upload_data[i].comment,
            comment1: upload_data[i].comment1,
            user: user._id,
            link: [added_link[0]._id],
          };
          console.log(data);

          await Data.create(data);
        } else {
          console.log("Email already present: ", upload_data[i].email);
        }
      }
      logger.info(
        `${ip}: API /api/v1/data/upload_data | User: ${user.name} | responnded with Success `
      );
      return res.status(200).send({ message: "Data Uploaded" });
    } else {
      logger.error(
        `${ip}: API /api/v1/data/upload_data | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (err) {
    console.error("Error getting category data count:", err);
  }
};

//@desc update inquiry Data by data id
//@route put /api/v1/inquiry/data//update/domain
//@access private: login required
const updateDomainData = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const {
    category,
    status,
    consultant_name,
    inquiry_type,
    exhi_for,
    exhibitor_date,

    selected_ids,
  } = req.body;

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    for (let i = 0; i < selected_ids.length; i++) {
      const olddata = await Data.findOne({ _id: selected_ids[i] });
      if (olddata) {
        const updateddata = {
          category: olddata.category + ", " + category,
          status,
          updateDate: Date.now(),
        };
        const result = await Data.findByIdAndUpdate(
          selected_ids[i],
          updateddata,
          {
            new: true,
          }
        );
      }
    }

    for (let i = 0; i < selected_ids.length; i++) {
      const data = await Data.findOne({ _id: selected_ids[i] });

      const oldData = await Inquiry_data.findOne({
        email: data.email,
      });
      if (!oldData) {
        await Inquiry_data.create({
          company_name: data.company_name,
          website: data.website,
          email: data.email,
          category: data.category,
          status: data.status,
          country: data.country,
          region: data.region,
          consultant_name: consultant_name,
          inquiry_type: inquiry_type,
          inquiry_source: "Added After Data Changed to Exhibitor",
          exhi_for: exhi_for,
          inquiry_date: exhibitor_date,
          exhibitor_date: exhibitor_date,
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
        });
      }
    }

    return res
      .status(201)
      .json({ message: "Inquiry Data Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

module.exports = {
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
  //getNewDataLeaderboard,
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
};
