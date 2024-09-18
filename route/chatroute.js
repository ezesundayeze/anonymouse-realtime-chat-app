const express = require("express");
const Chats = require("./../models/Chat");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  let data = await Chats.find({ sender: "Anonymous" });
  res.json(data)
});

module.exports = router;
