const db = require("../database/database");


// Create transaction
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
        amount,
        type,
        category,
        name,
        notes
    );


    res.status(201).json({

        success: true,

        id: result.lastInsertRowid

    });

};



// Get user's transactions
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



module.exports = {
    createTransaction,
    getTransactions
};