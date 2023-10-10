const mongoose = require("mongoose");
const logger = require("../config/logger.js");
const mongoDBURI = process.env.MONGOURL;

const connectToMongo = async () => {
  try {
    const connect = await mongoose.connect(mongoDBURI);
    console.log(
      "Connected to Mongo Successfully!",
      connect.connection.host,
      connect.connection.name
    );
    logger.info(
      `Connected to Mongo Successfully! Host: ${connect.connection.host}, DB Name:${connect.connection.name} `
    );
  } catch (err) {
    console.log({ data: err, message: "Connected to Mongo Failed!" });
    logger.error(`Connected to Mongo Failed!`);
    process.exit(1);
  }
};

module.exports = connectToMongo;
