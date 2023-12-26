const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const Data = require("../models/Data");
const logger = require("../config/logger.js");

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
    return res.status(401).send({ message: "User is not Autherized" });
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
    console.log(loggedin_user._id);
    const { id } = req.params;
    const data = await Data.find({
      link: id,
    })
      .populate("user")
      .populate("link");
    console.log(data);
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

//@desc update Data by data id
//@route put /api/v1/data/update/:id
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
    };
    const olddata = await Data.findOne({ _id: id });
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

    if (link_value) {
      filterQuery.link = link_value;
    }

    if (email) {
      filterQuery.email = email;
    }

    if (category != "1") {
      filterQuery.category = category;
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

    if (designation) {
      filterQuery.designation = designation;
    }

    if (products) {
      filterQuery.products = products;
    }

    if (created_from && created_to) {
      filterQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    if (approved_type != "1") {
      filterQuery.approved = approved_type;
    }
    const no_of_keys = Object.keys(filterQuery).length;
    let filteredData = [];
    if (no_of_keys > 0) {
      filteredData = await Data.find(filterQuery).populate("link");
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/data/generalise/get | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
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
  getDataByLinkId_user,
  getFilterData,
};
