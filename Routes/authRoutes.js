const express = require("express");
const { signup, signin } = require("./controllers/authController.js");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("signup route working");
});
router.post("/signin", signin);

module.exports = router;
