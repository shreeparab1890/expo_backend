const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const OldData = require("../models/OldData.js");
const User = require("../models/User.js");
const logger = require("../config/logger.js");
var axios = require("axios");
const excel = require("exceljs");
const fs = require("fs");
const path = require("path");

//@desc Test Data API
//@route GET /api/v1/data
//@access Private: Login Required
const testUserAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/old/data | User: ${user.name} | responnded with "Data API Test Successfully" `
    );
    return res.status(200).send("Data API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

const uploadOldData = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const folderPath = path.join(__dirname, "files2Upload");
  const fileNames = fs.readdirSync(folderPath);
  console.log(fileNames);

  if (user) {
    for (const fileName of fileNames) {
      if (fileName.endsWith(".xlsx")) {
        const workbook = new excel.Workbook();
        const filePath = path.join(folderPath, fileName);

        workbook.xlsx
          .readFile(filePath)
          .then(() => {
            const worksheet = workbook.getWorksheet(1);
            const newDataArray = [];
            //F-E
            worksheet.eachRow((row, rowIndex) => {
              if (rowIndex > 1) {
                //Compute Exhibitor Type
                let exhibitor_type = "";
                if (String(row.getCell(13).value).includes("F-E")) {
                  exhibitor_type = "Foreign Exhibitor";
                } else {
                  exhibitor_type = "Local Exhibitor";
                }

                //Compute WhatsApp Number
                let whatsapp = "";
                if (
                  String(row.getCell(10).value).includes("(W)") ||
                  String(row.getCell(10).value).includes("(w)")
                ) {
                  const mobileNumbers = [];
                  const numbersArray = String(row.getCell(10).value).split(
                    ", "
                  );
                  for (const number of numbersArray) {
                    if (number.includes("(W)")) {
                      mobileNumbers.push(number.trim());
                    }
                  }
                  const joined_num = mobileNumbers.join(", ");
                  whatsapp = joined_num.replace(/\(w\)|\(W\)/gi, "");
                } else {
                  whatsapp = "";
                }

                const data = {
                  company_name: String(row.getCell(1).value) || "",
                  email: String(row.getCell(2).value) || "",
                  website: String(row.getCell(3).value) || "",
                  product: String(row.getCell(4).value) || "",
                  category: String(row.getCell(5).value) || "",
                  source: String(row.getCell(6).value) || "",
                  contact: String(row.getCell(7).value) || "",
                  designation: String(row.getCell(8).value) || "",
                  tel: String(row.getCell(9).value) || "",
                  mobile: String(row.getCell(10).value).replace(
                    /\(w\)|\(W\)/gi,
                    ""
                  ), // Replace (W) or (w) from the string if exists
                  whatsapp: whatsapp.trim(),
                  country: String(row.getCell(11).value) || "",
                  region: String(row.getCell(12).value) || "",
                  comment: String(row.getCell(13).value) || "",
                  address: String(row.getCell(14).value) || "",
                  feedDate: String(row.getCell(15).value) || "",
                  lastupdateddate: String(row.getCell(16).value) || "",
                  status: String(row.getCell(17).value) || "",
                  exhibitor_type,
                };

                //const email = String(row.getCell(2).value);
                //const oldEmail = OldData.findOne({ email: email });
                //if (!oldEmail) {
                newDataArray.push(new OldData(data));
                //}
              }
            });

            // Save all newData documents in parallel
            Promise.all(newDataArray.map((newData) => newData.save()))
              .then(() => {})
              .catch((err) => {
                console.error("Error saving data:", err);
                //res.status(500).json({ message: "Error saving data" });
              });
          })
          .catch((err) => {
            console.error("Error reading Excel file:", err);
            //res.status(500).json({ message: "Internal server error" });
          });
      }
    }
    logger.info(
      `${ip}: API /api/v1/old/data/upload | User: ${user.name} | responded with Data uploaded successfully`
    );
    res.status(200).json({ message: "Data uploaded successfully" });
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data/upload | User: ${user.name} | responded with User is not Authorized`
    );
    return res.status(401).send({ message: "User is not Authorized" });
  }
};

const getFilterData = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const {
    company_name,
    email,
    website,
    product,
    category,
    source,
    contact,
    designation,
    tel,
    mobile,
    country,
    region,
    status,
    whatsapp,
    exhibitor_type,
    keyword,
  } = req.body;

  if (loggedin_user) {
    const filterQuery = {};

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

    if (product) {
      filterQuery.product = { $regex: new RegExp(`.*${product}.*`, "i") };
    }

    if (category != "1") {
      filterQuery.category = { $regex: new RegExp(`.*${category}.*`, "i") };
    }

    if (source) {
      filterQuery.source = { $regex: new RegExp(`.*${source}.*`, "i") };
    }

    if (contact) {
      filterQuery.contact = { $regex: new RegExp(`.*${contact}.*`, "i") };
    }

    if (mobile) {
      //filterQuery.mobile = { $regex: new RegExp(`.*${mobile}.*`, "i") };
      const escapedMobile = mobile.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      filterQuery.mobile = {
        $regex: new RegExp(`.*${escapedMobile}.*`, "i"),
      };
    }

    if (whatsapp) {
      //filterQuery.whatsapp = { $regex: new RegExp(`.*${whatsapp}.*`, "i") };
      const escapedWhatsapp = whatsapp.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&"
      );
      filterQuery.whatsapp = {
        $regex: new RegExp(`.*${escapedWhatsapp}.*`, "i"),
      };
    }

    if (tel) {
      //filterQuery.tel = { $regex: new RegExp(`.*${tel}.*`, "i") };
      const escapedTel = tel.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      filterQuery.tel = {
        $regex: new RegExp(`.*${escapedTel}.*`, "i"),
      };
    }

    /* if (status != "1") {
      filterQuery.status = status;
    } */
    if (status != "1") {
      filterQuery.status = status;
    } else if (status == "1") {
      filterQuery.status = { $ne: "Removes" };
    }

    if (country != "1") {
      filterQuery.country = country;
    }

    if (exhibitor_type != "1") {
      filterQuery.exhibitor_type = exhibitor_type;
    }

    if (region != "1") {
      filterQuery.region = region;
    }

    if (designation) {
      filterQuery.designation = designation;
    }
    if (keyword) {
      //console.log("keyword");
      //console.log(keyword);
      //const keywordRegex = new RegExp(`.*${keyword}.*`, "i");
      const escapedKeyword = keyword.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&"
      );
      const keywordRegex = {
        $regex: new RegExp(`.*${escapedKeyword}.*`, "i"),
      };
      const keywordFields = [
        "company_name",
        "website",
        "email",
        "category",
        "status",
        "country",
        "region",
        "mobile",
        "tel",
        "exhibitor_type",
        "address",
        "comment",
        "product",
        "contact",
        "source",
        "designation",
      ];
      const orQuery = keywordFields.map((field) => ({
        [field]: keywordRegex,
      }));
      filterQuery.$or = orQuery;
    }

    /* console.log("filterQuery");
    console.log(filterQuery); */
    const no_of_keys = Object.keys(filterQuery).length;
    //console.log(no_of_keys);
    let filteredData = [];
    if (no_of_keys >= 1) {
      filteredData = await OldData.find(filterQuery);
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/old/data/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/old/data/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
        data: [],
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

const getAllData = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const all_data = await OldData.find({
      active: true,
    });

    logger.info(
      `${ip}: API /api/v1/old/data/getall | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: all_data,
      message: "Data retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data/getall | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

const getDataByEmail = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email } = req.body;
  if (loggedin_user) {
    const data = await OldData.find({
      email,
    });

    if (data.length > 0) {
      logger.info(
        `${ip}: API /api/v1/old/data/get/byemail/ | User: ${loggedin_user.name} | responnded with Success `
      );

      return await res.status(200).json({
        data: data,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/old/data/get/byemail | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/old/data/get/byemail | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  testUserAPI,
  uploadOldData,
  getFilterData,
  getAllData,
  getDataByEmail,
};
