const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./controllers/authController.js");

console.log("authController.js has been loaded successfully.");

// Sign Up
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await User.create({ first_name, last_name, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign In
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
