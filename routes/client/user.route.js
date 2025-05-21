const express = require("express");
const controller = require("../../controllers/client/user.controller");
const router = express.Router();

const resetPasswordMiddleware = require("../../middlewares/client/reset-password.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otp);
router.post("/password/otp", controller.otpPost);
router.get(
  "/password/reset-password",
  authMiddleware.requireAuth,
  controller.resetPassword
);
router.post(
  "/password/reset-password",
  resetPasswordMiddleware.password,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router;
