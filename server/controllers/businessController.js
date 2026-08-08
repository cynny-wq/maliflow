const db = require("../database/database");


// Save business profile
const createBusiness = (req, res) => {

    const {
        business_name,
        owner_name,
        phone,
        currency
    } = req.body;


    const stmt = db.prepare(`
        INSERT INTO businesses
        (business_name, owner_name, phone, currency)
        VALUES (?, ?, ?, ?)
    `);


    const result = stmt.run(
        business_name,
        owner_name,
        phone,
        currency
    );


    res.status(201).json({
        success: true,
        id: result.lastInsertRowid
    });

};


// Get business profile

const getBusiness = (req, res) => {


    const business = db.prepare(`
        SELECT *
        FROM businesses
        ORDER BY id DESC
        LIMIT 1
    `).get();


    res.json(business || {});

};


module.exports = {
    createBusiness,
    getBusiness
};