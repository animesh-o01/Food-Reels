// Create Server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth.routes');
const foodRoutes = require('./Routes/food.routes');
const foodPartnerRoutes = require('./Routes/food-partner.routes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.status(200).send("Hello");
})
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

// Global error handler — must be last, after all routes
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

module.exports = app;