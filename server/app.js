const express = require("express");
const cors = require("cors");
const path = require("path");

require("./database/schema");

const transactionRoutes = require("./routes/transactions");
const customerRoutes = require("./routes/customers");
const businessRoutes = require("./routes/businesses");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());

app.use(express.json());

// Serve MaliFlow frontend
app.use(express.static(path.join(__dirname, "../client")));

// API routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/auth", authRoutes);

// Open MaliFlow frontend
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/login.html")
    );
});

// Health check
app.get("/api", (req, res) => {
    res.json({
        message: "MaliFlow API is running 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `MaliFlow server running on port ${PORT}`
    );
});