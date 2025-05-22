const express = require("express");
const multer = require("multer");
const upload = multer();
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/user.controller");

const router = express.Router();

router.get("/", controller.index);
router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloudMiddleware.upload,
  controller.editPatch
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.delete);

module.exports = router;
