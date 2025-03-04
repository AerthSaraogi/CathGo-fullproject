const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const scanRoutes = require("./routes/scanRoutes");
const creditRoutes = require("./routes/creditRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = 3000; // No external dotenv, set manually

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, "../Frontend")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
            process.exit(1);
        } else {
            console.error("❌ Server failed to start:", err);
        }
    });
