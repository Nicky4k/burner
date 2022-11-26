const express = require("express");
const { authUser } = require("../controllers/userControllers");

const router = express.Router();

router.route("/").post(authUser);

module.exports = router;
