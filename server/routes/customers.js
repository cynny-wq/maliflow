const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createCustomer,
    getCustomers,
    receivePayment,
    getPaymentHistory
} = require("../controllers/customerController");
// Get customers
router.get("/", auth, getCustomers);
router.post("/", auth, createCustomer);

router.put("/:id/payment", auth, receivePayment);
// Get customer payment history
router.get("/:id/payments", auth, getPaymentHistory);
module.exports = router;