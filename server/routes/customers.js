const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createCustomer,
    getCustomers,
    receivePayment
} = require("../controllers/customerController");
// Get customers
router.get("/", getCustomers);


// Add customer
router.post("/", createCustomer);

router.put("/:id/payment", auth, receivePayment);
module.exports = router;