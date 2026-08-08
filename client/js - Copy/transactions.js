const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");


const {
    createTransaction,
    getTransactions
} = require("../controllers/transactionController");


// Get all transactions
router.get("/", auth, getTransactions);


// Create transaction
router.post("/", auth, createTransaction);


module.exports = router;