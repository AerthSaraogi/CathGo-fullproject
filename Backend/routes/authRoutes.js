const express = require("express");
const router = express.Router();
const db = require("../db");

// User Registration
router.post("/register", (req, res) => {
    const { name, email, phone, country, password } = req.body;

    // Check if email already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert new user with default 20 credits
        db.run(
            "INSERT INTO users (name, email, phone, country, password, role, credits) VALUES (?, ?, ?, ?, ?, 'user', 20)",
            [name, email, phone, country, password],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ userId: this.lastID, message: "Registration successful" });
            }
        );
    });
});

// User/Admin Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Redirect based on role
        if (user.role === "admin") {
            res.json({ message: "Admin login successful", redirect: "admin.html" });
        } else {
            res.json({ message: "User login successful", redirect: "hero.html" });
        }
    });
});

module.exports = router;
