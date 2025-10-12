// GET /not-found-34076352
function getNotFound(req, res) {
  res.status(404).render("404.html");
}

module.exports = {
  getNotFound,
};

