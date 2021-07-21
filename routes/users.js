const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello Bruh!");
});

module.exports = router;
