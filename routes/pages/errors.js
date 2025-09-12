const express = require("express")
const router = express.Router();

router.get("/not-found-34076352", (req, res) => {
    res.status(404).render("404.html");
});



module.exports = router;
