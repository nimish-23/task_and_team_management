const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");
const wrapAsync = require("../middleware/wrapAsync");

router.post("/register", wrapAsync(authControllers.registerUser));
router.post("/login", wrapAsync(authControllers.loginUser));
router.get("/users", wrapAsync(authControllers.getAllUsers));

module.exports = router;
