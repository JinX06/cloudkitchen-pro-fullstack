const express = require("express");
const router = express.Router();

router.get("/welcome-34076352", (req, res) => {
  res.render("welcome.html");
});

module.exports = router;

