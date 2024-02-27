const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const Data = require("../models/Data");
const User = require("../models/User.js");
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
  };
  console.log(dataIds);
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
      link: id,
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
    const updateddata = {
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
      update_user: loggedin_user._id,
      link: [...new Set([...olddata.link, link])],
    };

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

    if (region) {
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
      filterQuery.user = loggedin_user._id; //User Specific
    }

    console.log(filterQuery);
    const no_of_keys = Object.keys(filterQuery).length;

    let filteredData = [];
    if (no_of_keys > 1) {
      filteredData = await Data.find(filterQuery).populate("link");
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

    if (region) {
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

    /*  if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      filterQuery.user = loggedin_user._id; //User Specific
    } */
    console.log(filterQuery);
    const no_of_keys = Object.keys(filterQuery).length;

    let filteredData = [];
    if (no_of_keys > 1) {
      filteredData = await Data.find(filterQuery).populate("link");
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
      category: { $regex: new RegExp(category, "i") },
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
//@route get /api/v1/link/get/data/leader
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
        $limit: 10,
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
        $limit: 10,
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
        $limit: 10,
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
        $limit: 10,
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
        $limit: 10,
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
        $limit: 10,
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
    const { givenLink, data_type } = req.body;

    let filteredData = [];
    if (
      loggedin_user.roleType != "super_admin" &&
      loggedin_user.roleType != "admin"
    ) {
      if (data_type == "new_data") {
        filteredData = await Data.find({
          "link.0": givenLink,
          user: loggedin_user._id,
        });
      } else if (data_type == "old_data") {
        filteredData = await Data.find({
          "link.0": { $ne: givenLink },
          link: {
            $elemMatch: { $eq: givenLink },
          },
          user: loggedin_user._id,
        });
      } else if (data_type == "both") {
        filteredData = await Data.find({
          link: {
            $elemMatch: { $eq: givenLink },
          },
          user: loggedin_user._id,
        });
      }
    } else {
      if (data_type == "new_data") {
        filteredData = await Data.find({
          "link.0": givenLink,
        });
      } else if (data_type == "old_data") {
        filteredData = await Data.find({
          "link.0": { $ne: givenLink },
          link: {
            $elemMatch: { $eq: givenLink },
          },
        });
      } else if (data_type == "both") {
        filteredData = await Data.find({
          link: {
            $elemMatch: { $eq: givenLink },
          },
        });
      }
    }

    if (filteredData.length > 0) {
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
};
