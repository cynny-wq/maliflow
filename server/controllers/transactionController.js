const db = require("../database/database");

// ===============================
// Create transaction
// ===============================
const createTransaction = (req, res) => {

    const user_id = req.user.id;

    const {
        type,
        amount,
        category,
        name,
        notes
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO transactions
        (
            user_id,
            type,
            amount,
            category,
            name,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        user_id,
        type,
        amount,
        category,
        name,
        notes
    );

    res.status(201).json({
        success: true,
        id: result.lastInsertRowid
    });
};


// ===============================
// Get user's transactions
// ===============================
const getTransactions = (req, res) => {

    const user_id = req.user.id;

    const stmt = db.prepare(`
        SELECT *
        FROM transactions
        WHERE user_id = ?
        ORDER BY id DESC
    `);

    const transactions = stmt.all(user_id);

    res.json(transactions);
};


// ===============================
// Edit transaction
// ===============================
const updateTransaction = (req, res) => {

    const user_id = req.user.id;
    const { id } = req.params;

    const {
        type,
        amount,
        category,
        name,
        notes
    } = req.body;

    const result = db.prepare(`
        UPDATE transactions
        SET
            type = ?,
            amount = ?,
            category = ?,
            name = ?,
            notes = ?
        WHERE id = ?
        AND user_id = ?
    `).run(
        type,
        amount,
        category,
        name,
        notes,
        id,
        user_id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Transaction not found"
        });
    }

    res.json({
        success: true,
        message: "Transaction updated successfully"
    });
};


// ===============================
// Delete transaction
// ===============================
const deleteTransaction = (req, res) => {

    const user_id = req.user.id;
    const { id } = req.params;

    const result = db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
        AND user_id = ?
    `).run(id, user_id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Transaction not found"
        });
    }

    res.json({
        success: true,
        message: "Transaction deleted successfully"
    });
};


// ===============================
// Exports
// ===============================
module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};