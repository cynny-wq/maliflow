const express = require("express");

const router = express.Router();


const {
    createBusiness,
    getBusiness
} = require("../controllers/businessController");



router.get("/", getBusiness);


router.post("/", createBusiness);



module.exports = router;