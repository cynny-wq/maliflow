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

    const { id } = req.params;
    const { amount } = req.body;

    const customer = db.prepare(`
        SELECT *
        FROM customers
        WHERE id = ?
    `).get(id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: "Customer not found"
        });
    }

    const newPaid =
        Number(customer.amount_paid) + Number(amount);

    const newOwed =
        Number(customer.amount_owed) - Number(amount);

    db.prepare(`
        UPDATE customers
        SET amount_paid = ?,
            amount_owed = ?
        WHERE id = ?
    `).run(newPaid, newOwed, id);

    res.json({
        success: true,
        message: "Payment received successfully"
    });

};
module.exports = {
    createCustomer,
    getCustomers,
    receivePayment
};
