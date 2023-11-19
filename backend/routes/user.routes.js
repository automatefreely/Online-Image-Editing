const express = require("express");
const { register, login, changePassword, resetPassword, forgetPassword, googleIdVerifyAndLogin } = require("../controllers/auth.controllers");
const { isAuthorised } = require("../middlewares/auth.middewares");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/changePassword").put(isAuthorised, changePassword);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/signin/google").post(googleIdVerifyAndLogin);

module.exports = router;
