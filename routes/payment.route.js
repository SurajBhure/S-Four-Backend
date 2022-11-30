const express = require("express");
const router = express.Router();

const {
  paymentProcess,
  checkOutSession,
} = require("../controllers/payment.controller");

router.post("/create-checkout-session", paymentProcess);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  checkOutSession
);

module.exports = router;
