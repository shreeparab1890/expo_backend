const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const logger = require("./config/logger.js");
const connectToMongo = require("./config/db.js");

connectToMongo();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5001;

//Test API: GET /api/v1/
app.get("/api/v1/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.status(200).send("Welcome to Backend API for ExpoGroup");
  logger.info(
    `${ip}: API /api/v1/ responnded with "Welcome to Backend API for ExpoGroup" `
  );
});

//Routes
app.use("/api/v1/user", require("./routes/user.js"));
app.use("/api/v1/role", require("./routes/role.js"));
app.use("/api/v1/department", require("./routes/department.js"));
app.use("/api/v1/link", require("./routes/link.js"));
app.use("/api/v1/data", require("./routes/data.js"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
