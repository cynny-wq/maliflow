const db = require("../database/database");


// Create customer
const createCustomer = (req, res) => {

    const { name, amount_owed } = req.body;


    const stmt = db.prepare(`
        INSERT INTO customers
        (name, amount_owed)
        VALUES (?, ?)
    `);


    const result = stmt.run(
        name,
        amount_owed
    );


    res.status(201).json({
        success: true,
        id: result.lastInsertRowid
    });

};


// Get customers
const getCustomers = (req, res) => {

    const customers = db.prepare(`
        SELECT *
        FROM customers
        ORDER BY id DESC
    `).all();


    res.json(customers);

};


const receivePayment = (req, res) => {

    const user_id = req.user.id;
    const { id } = req.params;
    const { amount } = req.body;

    const payment = Number(amount);

    // Validate payment
    if (!Number.isFinite(payment) || payment <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid payment amount"
        });
    }

    // Find customer belonging to this user
    const customer = db.prepare(`
        SELECT *
        FROM customers
        WHERE id = ?
        AND user_id = ?
    `).get(id, user_id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: "Customer not found"
        });
    }

    const currentOwed =
        Number(customer.amount_owed || 0);

    const currentPaid =
        Number(customer.amount_paid || 0);

    // Prevent overpayment
    if (payment > currentOwed) {
        return res.status(400).json({
            success: false,
            message:
                `Payment cannot be greater than the amount owed (KSh ${currentOwed.toLocaleString()})`
        });
    }

    const newPaid =
        currentPaid + payment;

    const newOwed =
        currentOwed - payment;

    // Update customer
    db.prepare(`
        UPDATE customers
        SET
            amount_paid = ?,
            amount_owed = ?
        WHERE id = ?
        AND user_id = ?
    `).run(
        newPaid,
        newOwed,
        id,
        user_id
    );

    // Save payment history
    db.prepare(`
        INSERT INTO customer_payments
        (
            user_id,
            customer_id,
            amount
        )
        VALUES (?, ?, ?)
    `).run(
        user_id,
        id,
        payment
    );

    res.json({
        success: true,
        message: "Payment received successfully",
        amount_paid: newPaid,
        amount_owed: newOwed
    });
};
// ===============================
// Get Customer Payment History
// ===============================
const getPaymentHistory = (req, res) => {

    const user_id = req.user.id;
    const { id } = req.params;

    const customer = db.prepare(`
        SELECT id
        FROM customers
        WHERE id = ?
        AND user_id = ?
    `).get(id, user_id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: "Customer not found"
        });
    }

    const payments = db.prepare(`
        SELECT
            id,
            amount,
            created_at
        FROM customer_payments
        WHERE customer_id = ?
        AND user_id = ?
        ORDER BY id DESC
    `).all(id, user_id);

    res.json({
        success: true,
        payments
    });
};
module.exports = {
    createCustomer,
    getCustomers,
    receivePayment,
    getPaymentHistory
};
