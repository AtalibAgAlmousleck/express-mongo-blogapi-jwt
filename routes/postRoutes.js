const { Router } = require("express");

const router = Router();

router.get("/", function (req, res, next) {
  res.json("This is the post router");
});

module.exports = router;
