const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");


// Get all transactions
router.get("/", auth, getTransactions);


// Create transaction
router.post("/", auth, createTransaction);


// Edit transaction
router.put("/:id", auth, updateTransaction);


// Delete transaction
router.delete("/:id", auth, deleteTransaction);


module.exports = router;