const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Link = require("../models/Link.js");
const Data = require("../models/Data.js");
const Notifications = require("../models/Notification.js");
const User = require("../models/User.js");

//@desc Test Link API
//@route GET /api/v1/link
//@access Private: Role Admin / superadmin
const testLinkAPI = async (req, res) => {
  try {
    const user = req.user;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (user) {
      logger.info(
        `${ip}: API /api/v1/link | User: ${user.name} | responnded with Link Api Successful `
      );
      return res
        .status(200)
        .send({ data: user, message: "Link Api Successful" });
    } else {
      logger.error(
        `${ip}: API /api/v1/link | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error", message: err.message });
  }
};

//Function get month and year from a date string
function getMonthAndYear(dateString) {
  var date = new Date(dateString);
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return { month: month, year: year };
}

//@desc Create New Link
//@route GET /api/v1/link/add
//@access Private: Role Admin / superadmin
const createLink = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const oldLink = await Link.findOne({ name: data.name, value: data.value });
    if (oldLink) {
      logger.error(
        `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Link already Exists! for Link: ${data.value} `
      );
      return res.status(400).json({ message: "Link already Exists!" });
    }

    const month_year = getMonthAndYear(data.start_date);

    if (data.link_type == "Exhibition") {
      if (data.start_date == "" || data.end_date == "") {
        logger.error(
          `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Error `
        );
        return res
          .status(500)
          .json({ error: "Error", message: "Enter Valid Start and End Date" });
      }
      const users = await User.find({
        roleType: { $in: ["admin", "super_admin"] },
      });

      await Link.create({
        name: data.name,
        value: data.value,
        priority: data.priority,
        link_type: data.link_type,
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        month: month_year.month,
        year: month_year.year,
        mode: data.mode,
        country: data.country,
        link_comment: data.link_comment,
        source_user: user._id,
      })
        .then((link) => {
          logger.info(
            `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Success `
          );
          users.forEach(function (usr) {
            const res_notification = Notifications.create({
              text: `New Link:${link.name}  is Added by ${user.name}`,
              type: "success",
              to_user: usr._id,
              by_user: user._id,
            });
          });

          return res
            .status(201)
            .json({ link, message: "Link Added Successfully" });
        })
        .catch((err) => {
          logger.error(
            `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Error `
          );
          return res.status(500).json({ error: "Error", message: err.message });
        });
    } else {
      const users = await User.find({
        roleType: { $in: ["admin", "super_admin"] },
      });

      await Link.create({
        name: data.name,
        value: data.value,
        priority: data.priority,
        link_type: data.link_type,
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        month: data.month,
        year: data.year,
        mode: data.mode,
        country: data.country,
        link_comment: data.link_comment,
        source_user: user._id,
      })
        .then((link) => {
          logger.info(
            `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Success `
          );
          users.forEach(function (usr) {
            const res_notification = Notifications.create({
              text: `New Link:${link.name} is Added by ${user.name}`,
              type: "success",
              to_user: usr._id,
              by_user: user._id,
            });
          });
          return res
            .status(201)
            .json({ link, message: "Link Added Successfully" });
        })
        .catch((err) => {
          logger.error(
            `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with Error `
          );
          return res.status(500).json({ error: "Error", message: err.message });
        });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/link/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update  Link
//@route POST /api/v1/link/update/:id
//@access Private: Role Admin / superadmin
const UpdateLink = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/update/:id responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  if (user) {
    const data = matchedData(req);
    if (data.link_type == "Exhibition") {
      if (data.start_date == "" || data.end_date == "") {
        logger.error(
          `${ip}: API /api/v1/link/update/:id | User: ${user.name} | responnded with Error `
        );
        return res
          .status(500)
          .json({ error: "Error", message: "Enter Valid Start and End Date" });
      }
      const month_year = getMonthAndYear(data.start_date);
      const updatedLink = {
        name: data.name,
        value: data.value,
        priority: data.priority,
        link_type: data.link_type,
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        month: month_year.month,
        year: month_year.year,
        mode: data.mode,
        country: data.country,
        link_comment: data.link_comment,
        UpdatedDate: Date.now(),
        update_user: user._id,
      };

      const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
        new: true,
      });
      logger.info(
        `${ip}: API /api/v1/link/update/:id | User: ${user.name} | Link with Id:${linkId} Updated`
      );

      return res.status(200).json({ result, message: "Link Updated." });
    } else {
      const updatedLink = {
        name: data.name,
        value: data.value,
        priority: data.priority,
        link_type: data.link_type,
        category: data.category,
        start_date: null,
        end_date: null,
        month: data.month,
        year: data.year,
        mode: data.mode,
        country: data.country,
        link_comment: data.link_comment,
        UpdatedDate: Date.now(),
        update_user: user._id,
      };

      const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
        new: true,
      });
      logger.info(
        `${ip}: API /api/v1/link/update/:id | User: ${user.name} | Link with Id:${linkId} Updated`
      );

      return res.status(200).json({ result, message: "Link Updated." });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/link/update/:id | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Update  Link
//@route POST /api/v1/link/update/comment/:id
//@access Private: Role Admin / superadmin
const UpdateLinkComment = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/update/:id responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    const updatedLink = {
      link_comment: data.link_comment,
      UpdatedDate: Date.now(),
      update_user: user._id,
    };

    const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
      new: true,
    });
    logger.info(
      `${ip}: API /api/v1/link/update/comment/:id | User: ${user.name} | Link with Id:${linkId} Updated`
    );

    return res.status(200).json({ result, message: "Link comment Updated." });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/update/comment/:id | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Assign Link to user
//@route POST /api/v1/link/assign
//@access Private: Role Admin / superadmin
const assignLink = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/assign responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user.roleType == "super_admin" || user.roleType == "admin") {
    const data = matchedData(req);

    const updatedLink = {
      $push: {
        assign_user: {
          user: data.assign_user,
          remark: data.remark,
          status: "Assigned",
          active: true,
          assign_date: Date.now(),
        },
      },
      remark: data.remark,
      assign_status: "Assigned",
      UpdatedDate: Date.now(),
      update_user: user._id,
    };

    const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
      new: true,
    })
      .populate("assign_user")
      .populate("source_user");

    const final_result = await result.populate("assign_user");

    const link_dtl = await Link.find({ _id: linkId });
    const link_value = link_dtl[0].value;

    const res_notification = await Notifications.create({
      text: `New Link is Assigned to you for Data Entry, Link:${link_value}`,
      type: "success",
      to_user: data.assign_user,
      by_user: user._id,
    });

    logger.info(
      `${ip}: API /api/v1/link/assign | User: ${user.name} | Link with Id:${linkId} Assigned to the User with Id:${data.assign_user}`
    );
    return res
      .status(200)
      .json({ final_result, message: "Link Assigned to the User." });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/assign | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Assign Link to user
//@route POST /api/v1/link/unassign
//@access Private: Role Admin / superadmin
const unassignLink = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.link_id;
  const assign_id = req.params.assign_id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/unassign responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user.roleType == "super_admin" || user.roleType == "admin") {
    const data = matchedData(req);

    const result = await Link.findOneAndUpdate(
      {
        _id: linkId,
        "assign_user._id": assign_id,
      },
      {
        $set: {
          "assign_user.$.active": false,
          "assign_user.$.status": "UnAssigned",
        },
      },
      { new: true }
    )
      .populate("assign_user")
      .populate("source_user");
    logger.info(
      `${ip}: API /api/v1/link/unassign | User: ${user.name} | Link with Id:${linkId} UnAssigned`
    );

    /* console.log("result");
    console.log(result); */
    const unassign_user = result.assign_user.filter(
      (user) => user._id == assign_id
    );
    /* console.log("unassign_user[0].user");
    console.log(unassign_user[0].user); */
    const link_dtl = await Link.find({ _id: linkId });
    const link_value = link_dtl[0].value;

    const res_notification = await Notifications.create({
      text: `Link has been unassigned, Link:${link_value}`,
      type: "danger",
      to_user: unassign_user[0].user,
      by_user: user._id,
    });

    /* const final_result = await result
      .populate("assign_user")
      .populate("source_user"); */
    /* console.log(final_result); */
    const activeAssignUserCount = result.assign_user.filter(
      (user) => user.active
    ).length;

    /* console.log(activeAssignUserCount); */
    if (activeAssignUserCount == 0) {
      const result = await Link.findByIdAndUpdate(
        linkId,
        {
          assign_status: "UnAssigned",
        },
        {
          new: true,
        }
      ).populate("assign_user");
      return res.status(200).json({ result, message: "Link UnAssigned." });
    }
    return res.status(200).json({ result, message: "Link UnAssigned." });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/unassign | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get all Links
//@route POST /api/v1/link/getall
//@access Private: Role Admin / superadmin
const getAllLinks = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const links = await Link.find({
      active: true,
    })

      .sort({ start_date: 1 })
      .sort({ month: -1 })
      .sort({ year: -1 })
      .populate("assign_user")
      .populate("source_user")
      .populate("assign_user.user");

    logger.info(
      `${ip}: API /api/v1/link/getall | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: links,
      message: "Links retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/getall | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get all user assigned Links
//@route POST /api/v1/link/getall/:userId
//@access Private: Role Admin / superadmin
const getAllUserLinks = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const userId = req.params.userId;
  if (user) {
    const links = await Link.find({
      active: true,
      assign_user: {
        $elemMatch: {
          user: userId,
          active: true,
        },
      },
    })

      .sort({ start_date: 1 })
      .sort({ month: -1 })
      .sort({ year: -1 })
      .populate("assign_user")
      .populate("source_user")
      .populate("assign_user.user");

    logger.info(
      `${ip}: API /api/v1/link/getall | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: links,
      message: "Links retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/getall | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get all Links with data
//@route POST /api/v1/link/getall/data
//@access Private: Role Admin / superadmin
const getAllLinksData = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const datas = await Data.find({
      active: true,
    }).populate("link");

    const data_links = [];
    for (let i = 0; i < datas.length; i++) {
      data_links.push(datas[i].link);
    }
    const links = [];
    for (let i = 0; i < data_links.length; i++) {
      links.push(data_links[i]);
    }
    const all_links = [];
    links.forEach((dataArray, index) => {
      dataArray.forEach((link) => {
        all_links.push(link._id);
      });
    });
    const uniqueLinkIds = [...new Set(all_links)];

    const all_links_data = [];
    for (i = 0; i < uniqueLinkIds.length; i++) {
      const link = await Link.find({
        active: true,
        _id: uniqueLinkIds[i],
      })
        .populate("assign_user")
        .populate("source_user")
        .populate("assign_user.user")
        .populate("update_user");
      all_links_data.push(link[0]);
    }

    logger.info(
      `${ip}: API /api/v1/link/getall/data | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: all_links_data,
      message: "Links with data retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/getall/data | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get all Links with data QA (approved = false)
//@route POST /api/v1/link/getall/data/qa
//@access Private: Role Admin / superadmin
const getAllLinksDataQA = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  if (user) {
    const datas = await Data.find({
      active: true,
      approved: false,
    }).populate("link");

    const data_links = [];
    for (let i = 0; i < datas.length; i++) {
      data_links.push(datas[i].link);
    }
    const links = [];
    for (let i = 0; i < data_links.length; i++) {
      links.push(data_links[i]);
    }
    const all_links = [];
    links.forEach((dataArray, index) => {
      dataArray.forEach((link) => {
        all_links.push(link._id);
      });
    });
    const uniqueLinkIds = [...new Set(all_links)];

    const all_links_data = [];
    for (i = 0; i < uniqueLinkIds.length; i++) {
      const link = await Link.find({
        active: true,
        _id: uniqueLinkIds[i],
      })
        .populate("assign_user")
        .populate("source_user")
        .populate("assign_user.user");
      all_links_data.push(link[0]);
    }

    logger.info(
      `${ip}: API /api/v1/link/getall/data/qa | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: all_links_data,
      message: "QA Links with data retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/getall/data/qa | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get all Links by email
//@route POST /api/v1/link/get/email
//@access Private: Role Admin / superadmin
const getLinksByEmail = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/link/get/email responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  if (user) {
    const data = matchedData(req);

    const datas = await Data.find({
      email: data.email,
    }).populate("link");

    if (datas.length > 0) {
      const data_links = datas[0].link;
      const uniqueLinkIds = [...new Set(data_links)];
      const all_links_data = [];
      for (let i = 0; i < uniqueLinkIds.length; i++) {
        const link = await Link.find({
          active: true,
          _id: uniqueLinkIds[i],
        })
          .populate("assign_user")
          .populate("source_user")
          .populate("assign_user.user");
        all_links_data.push(link[0]);
      }
      logger.info(
        `${ip}: API /api/v1/link/getall/data/qa | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: all_links_data,
        message: "Links with Email retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/link/getall/data/qa | User: ${user.name} | responnded with No Data `
      );
      return await res.status(201).json({
        message: "No Data With the email found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/link/getall/data/qa | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Link by id
//@route GET /api/v1/link/get/:id
//@access private: Admin/Superadmin
const getLink = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;

    const link = await Link.find({ _id: id }).populate({
      path: "assign_user.user",
    });

    const activeAssignUsers = link[0].assign_user.filter((user) => user.active);

    if (link.length > 0) {
      logger.info(
        `${ip}: API /api/v1/link/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: activeAssignUsers,
        message: "Link retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/link/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Link was not found `
      );
      return await res.status(200).json({
        message: "Link Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/Link/get/ | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Link by id
//@route GET /api/v1/link/get/:id
//@access private: Admin/Superadmin
const getLink_generalise = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const { id } = req.params;

    const link = await Link.find({ _id: id })
      .populate({
        path: "assign_user.user",
      })
      .populate("source_user");

    if (link.length > 0) {
      logger.info(
        `${ip}: API /api/v1/link/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: link,
        message: "Link retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/link/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Link was not found `
      );
      return await res.status(200).json({
        message: "Link Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/Link/get/ | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Links by user id
//@route GET /api/v1/link/get/user/:id
//@access private: login required
const getAllLinksbyUser = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    const links = await Link.find({
      assign_user: {
        $elemMatch: {
          user: user._id,
          active: true,
        },
      },
      active: true,
    })
      .populate("assign_user")
      .populate("assign_user.user");

    logger.info(
      `${ip}: API /api/v1/link/get/user/ | User: ${user.name} | responnded with Success `
    );
    return await res.status(200).json({
      data: links,
      message: "User links retrived successfully",
    });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/user | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Change remark by link id
//@route GET /api/v1/link/change/remark/:id
//@access private: login required
const changeRemark = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/link/change/remark/:id responnded with Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const updatedLink = {
    remark: data.remark,
  };

  const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
    new: true,
  });
  logger.info(
    `${ip}: API /api/v1/link/change/remark/:id | User: ${user.name} | Remark for the Link with Id:${linkId} Updated`
  );

  const final_result = await result.populate("assign_user");
  return res
    .status(200)
    .json({ final_result, message: "Link Remark Updated." });
};

//@desc Change status by link id
//@route GET /api/v1/link/change/status/:id
//@access private: login required
const changeStatus = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/link/change/status/:id responnded with Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const updatedLink = {
    assign_status: data.status,
    compeleted_date: data.compeleted_date,
  };

  /* const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
    new: true,
  }); */
  const result = await Link.findOneAndUpdate(
    { _id: linkId, "assign_user._id": data.object_id },
    {
      $set: {
        "assign_user.$.status": data.status,
        "assign_user.$.compeleted_date": data.compeleted_date,
      },
    },
    { new: true }
  );
  logger.info(
    `${ip}: API /api/v1/link/change/status/:id | User: ${user.name} | Status of the Link with Id:${linkId} Updated`
  );

  const final_result = await result.populate("assign_user");

  // Check if only items with active true have the status 'Accepted'
  const onlyActiveAccepted = final_result.assign_user.every((item) => {
    if (item.active) {
      return item.status === "Accepted";
    } else {
      return true;
    }
  });

  // Check if only items with active true have the status 'Completed'
  const onlyActiveCompleted = final_result.assign_user.every((item) => {
    if (item.active) {
      return item.status === "Completed";
    } else {
      return true;
    }
  });

  // Check if only items with active true have the status 'OnHold'
  const onlyActiveOnHold = final_result.assign_user.every((item) => {
    if (item.active) {
      return item.status === "OnHold";
    } else {
      return true;
    }
  });

  // Check if only items with active true have the status 'Aborted'
  const onlyActiveAborted = final_result.assign_user.every((item) => {
    if (item.active) {
      return item.status === "Aborted";
    } else {
      return true;
    }
  });

  if (onlyActiveAccepted) {
    const updatedLink1 = {
      assign_status: "Accepted",
    };
    const su_res = await Link.findByIdAndUpdate(linkId, updatedLink1, {
      new: true,
    });
    const final_result1 = await su_res.populate("assign_user");
    return res
      .status(200)
      .json({ final_result1, message: "Link Status Updated." });
  }
  if (onlyActiveCompleted) {
    const updatedLink1 = {
      assign_status: "Completed",
      compeleted_date: data.compeleted_date,
    };
    const su_res = await Link.findByIdAndUpdate(linkId, updatedLink1, {
      new: true,
    });
    const final_result1 = await su_res.populate("assign_user");
    return res
      .status(200)
      .json({ final_result1, message: "Link Status Updated." });
  }
  if (onlyActiveOnHold) {
    const updatedLink1 = {
      assign_status: "OnHold",
    };
    const su_res = await Link.findByIdAndUpdate(linkId, updatedLink1, {
      new: true,
    });
    const final_result1 = await su_res.populate("assign_user");
    return res
      .status(200)
      .json({ final_result1, message: "Link Status Updated." });
  }
  if (onlyActiveAborted) {
    const updatedLink1 = {
      assign_status: "Aborted",
    };
    const su_res = await Link.findByIdAndUpdate(linkId, updatedLink1, {
      new: true,
    });
    const final_result1 = await su_res.populate("assign_user");
    return res
      .status(200)
      .json({ final_result1, message: "Link Status Updated." });
  }

  /* console.log(onlyActiveAccepted);
  console.log(onlyActiveCompleted);
  console.log(onlyActiveOnHold);
  console.log(onlyActiveAborted); */

  return res
    .status(200)
    .json({ final_result, message: "Link Status Updated." });
};

//@desc Change status for all by link id
//@route GET /api/v1/link/change/all/status/:id
//@access private: login required
const changeAllStatus = async (req, res) => {
  const errors = validationResult(req);
  const user = req.user;
  const linkId = req.params.id;
  console.log(linkId);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/link/change/all/status/:id responnded with Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const updatedLink = {
    assign_status: data.status,
  };

  /* const result = await Link.findByIdAndUpdate(linkId, updatedLink, {
    new: true,
  }); */
  const result = await Link.findOneAndUpdate(
    { _id: linkId },
    {
      $set: {
        "assign_user.$[].status": data.status,
      },
    },
    { new: true }
  );
  logger.info(
    `${ip}: API /api/v1/link/change/all/status/:id | User: ${user.name} | Status of the Link with Id:${linkId} Updated`
  );

  const final_result = await result.populate("assign_user");

  const updatedLink1 = {
    assign_status: data.status,
  };
  const su_res = await Link.findByIdAndUpdate(linkId, updatedLink1, {
    new: true,
  });
  const final_result1 = await su_res.populate("assign_user");
  return res
    .status(200)
    .json({ final_result1, message: "Link Status Updated." });

  return res
    .status(200)
    .json({ final_result, message: "Link Status Updated." });
};

//@desc Delete link with id (we are updating active to false )
//@route PUT /api/v1/link/delete/:id
//@access private: Role Super Admin
const deleteLink = async (req, res) => {
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const user = req.user;

  try {
    if (user.roleType == "super_admin") {
      const updatedLink = {
        active: false,
      };
      const oldLink = await Link.findOne({ _id: id });
      if (oldLink) {
        const result = await Link.findByIdAndUpdate(id, updatedLink, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/link/delete/:${id} | User: ${user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: result, message: "Link Deleted Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/link/delete/:${id} | User: ${user.name} | responnded with Link Not Found `
        );
        return res.status(200).json({ message: "Link Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/link/delete/:${id} | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/link/delete/:${id} | User: ${user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc filter Links
//@route post /api/v1/link/filter
//@access private: login required
const getFilterLinks = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const {
    name,
    value,
    link_type,
    category,
    assign_status,
    country,
    mode,
    start_date,
    end_date,
    month,
    year,
    created_from,
    created_to,
    source_user,
    assign_user,
  } = req.body;

  if (loggedin_user) {
    /* console.log(
      name,
      value,
      link_type,
      category,
      assign_status,
      country,
      mode,
      start_date,
      end_date,
      month,
      year,
      created_from,
      created_to
    ); */
    const filterQuery = {};

    if (name) {
      filterQuery.name = { $regex: new RegExp(`.*${name}.*`, "i") };
    }

    if (value) {
      filterQuery.value = { $regex: new RegExp(`.*${value}.*`, "i") };
    }

    if (link_type != "0") {
      filterQuery.link_type = link_type;
    }

    if (category != "1") {
      filterQuery.category = category;
    }

    if (assign_status != "1") {
      filterQuery.assign_status = assign_status;
    }

    if (country != "0") {
      filterQuery.country = country;
    }

    if (mode != "0") {
      filterQuery.mode = mode;
    }

    if (month != "0") {
      filterQuery.month = month;
    }

    if (source_user != "0") {
      filterQuery.source_user = source_user;
    }

    if (assign_user != "0") {
      filterQuery.assign_user = {};
      filterQuery.assign_user.$elemMatch = { user: assign_user, active: true };
    }

    if (year != "0") {
      filterQuery.$or = [
        { year: year },
        {
          start_date: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${parseInt(year, 10) + 1}-01-01`),
          },
        },
      ];
    }

    if (start_date & end_date) {
      filterQuery.startDate = { $gte: startDate };
      filterQuery.end_date = { $lte: end_date };
    }

    if (created_from && created_to) {
      filterQuery.createDate = { $gte: created_from, $lte: created_to };
    }

    /* console.log(filterQuery); */
    const no_of_keys = Object.keys(filterQuery).length;
    let filteredData = [];
    if (no_of_keys > 0) {
      filteredData = await Link.find(filterQuery)
        .populate("source_user")
        .populate("assign_user.user");
    }

    if (filteredData.length > 0) {
      logger.info(
        `${ip}: API /api/v1/link/filter | User: ${loggedin_user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: filteredData,
        message: "Data retrived successfully",
      });
    } else {
      logger.info(
        `${ip}: API /api/v1/link/filter | User: ${loggedin_user.name} | responnded Empty i.e. Data was not found `
      );
      return await res.status(200).json({
        message: "Data Not Found",
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/link/filter | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/link/leaderboard
//@access private: login required
const getLinkLeaderboard = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (loggedin_user) {
    const pipeline = [
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/link/leaderboard | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/link/leaderboard | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/link/leaderboard | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/today
//@access private: login required
const getLinkLeaderToday = async (req, res) => {
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
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: todayStart,
            $lte: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/yesterday
//@access private: login required
const getLinkLeaderYesterday = async (req, res) => {
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
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/thisweek
//@access private: login required
const getLinkLeaderThisWeek = async (req, res) => {
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
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: thisWeekStart,
            $lte: thisWeekEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/lastweek
//@access private: login required
const getLinkLeaderLastWeek = async (req, res) => {
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

    const pipeline = [
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: lastWeekStart,
            $lte: lastWeekEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/thismonth
//@access private: login required
const getLinkLeaderThisMonth = async (req, res) => {
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
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: thisMonthStart,
            $lte: thisMonthEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc get add link leader board
//@route get /api/v1/link/get/leader/lastmonth
//@access private: login required
const getLinkLeaderLastMonth = async (req, res) => {
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
          from: "links",
          localField: "_id",
          foreignField: "source_user",
          as: "links",
        },
      },
      {
        $unwind: "$links",
      },
      {
        $match: {
          "links.createDate": {
            $gte: lastMonthStart,
            $lte: lastMonthEnd,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          linkCount: { $sum: 1 },
        },
      },
      {
        $sort: { linkCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    User.aggregate(pipeline)
      .then((leaderboard) => {
        logger.info(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with leaderboard `
        );
        return res.status(201).send({ leaderboard });
      })
      .catch((err) => {
        console.error(err);
        logger.error(
          `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with Error `
        );
        return res.status(401).send({ message: "Error", error: err });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/link/get/leader/today | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  testLinkAPI,
  createLink,
  assignLink,
  unassignLink,
  getAllLinks,
  getAllUserLinks,
  getAllLinksData,
  getAllLinksDataQA,
  getLink,
  getAllLinksbyUser,
  changeRemark,
  changeStatus,
  changeAllStatus,
  UpdateLink,
  UpdateLinkComment,
  getLink_generalise,
  deleteLink,
  getFilterLinks,
  getLinkLeaderboard,
  getLinkLeaderToday,
  getLinkLeaderYesterday,
  getLinkLeaderThisWeek,
  getLinkLeaderLastWeek,
  getLinkLeaderThisMonth,
  getLinkLeaderLastMonth,
  getLinksByEmail,
};
