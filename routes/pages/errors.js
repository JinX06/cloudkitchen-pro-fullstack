const express = require("express")
const router = express.Router();

router.get("/not-found-34076352", (req, res) => {
    res.status(404).render("404.html");
});

router.get("/error-34076352", (req, res) => {
  // Grab and reset error object stored in app.locals
  const errorOBJ = req.app.locals.errorOBJ;
  req.app.locals.errorOBJ = null;

  let code = "ERROR";
  let message = "An unexpected error occurred.";

  if (typeof errorOBJ === "object" && errorOBJ !== null) {
      code = errorOBJ.status || code;
      message = errorOBJ.message || message;
  }

  res.status(code).render("error.html", { code, message });
});

router.get(/.*/, (req, res) => {
    res.status(404).redirect("/not-found-34076352");
});


module.exports = router;

