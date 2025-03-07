const express = require("express");
const router = express.Router();
const db = require("../database/db");

// User Registration
router.post("/register", (req, res) => {
    const { name, email, phone, country, password } = req.body;

    if (!name || !email || !phone || !country || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (user) return res.status(400).json({ error: "Email already exists" });

        // Insert new user with default 20 credits
        db.run(
            "INSERT INTO users (name, email, phone, country, password, role, credits) VALUES (?, ?, ?, ?, ?, 'user', 20)",
            [name, email, phone, country, password],
            function (err) {
                if (err) return res.status(500).json({ error: "Database error" });
                res.json({ userId: this.lastID, message: "Registration successful" });
            }
        );
    });
});

// User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.get("SELECT id, name, password, role FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Send role information to frontend
        res.json({ message: "Login successful", userId: user.id, role: user.role });
    });
});



module.exports = router;
