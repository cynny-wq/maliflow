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

// ===============================
// Serve MaliFlow frontend
// ===============================

app.use(express.static(path.join(__dirname, "../client")));

// ===============================
// API routes
// ===============================

app.use("/api/transactions", transactionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/auth", authRoutes);

// ===============================
// Frontend pages
// ===============================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/login.html")
    );
});

app.get("/register.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/register.html")
    );
});

app.get("/login.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/login.html")
    );
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/dashboard.html")
    );
});

app.get("/cash.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/cash.html")
    );
});

app.get("/customers.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/customers.html")
    );
});

app.get("/transactions.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/transactions.html")
    );
});

app.get("/profile.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/pages/profile.html")
    );
});

// ===============================
// Health check
// ===============================

app.get("/api", (req, res) => {
    res.json({
        message: "MaliFlow API is running 🚀"
    });
});

// ===============================
// Start server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `MaliFlow server running on port ${PORT}`
    );
});