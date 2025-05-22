const express = require("express");

const controller = require("../../controllers/client/checkout.controller");
const router = express.Router();

router.get("/", controller.index);

router.get("/order/:orderId", controller.checkout);
router.post("/order", controller.checkoutPost);

module.exports = router;
