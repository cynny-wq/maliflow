const express = require("express");
const cors = require("cors");
require("./database/schema");
const transactionRoutes = require("./routes/transactions");
const customerRoutes = require("./routes/customers");
const businessRoutes = require("./routes/businesses");
const authRoutes = require("./routes/auth");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/businesses", businessRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req,res)=>{

    res.json({
        message:"MaliFlow API is running 🚀"
    });

});



const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

    console.log(
        `MaliFlow server running on port ${PORT}`
    );

});
