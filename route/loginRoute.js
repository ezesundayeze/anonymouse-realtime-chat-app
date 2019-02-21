const express = require("express");
const router = express.Router();

router.route("/").post((req, res, next) => {
  username = localStorage.setItem("user", req.body.username);
});

module.exports = router;
