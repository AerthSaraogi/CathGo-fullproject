const express = require("express");
const db = require("../database/db");

const router = express.Router();

// ✅ User Registration (No bcrypt, plain password storage)
router.post("/register", (req, res) => {
    const { name, email, phone, country, password } = req.body;

    if (!name || !email || !phone || !country || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (row) return res.status(400).json({ error: "Email already registered" });

        db.run(
            "INSERT INTO users (name, email, phone, country, password, credits) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, phone, country, password, 100],
            function (err) {
                if (err) return res.status(500).json({ error: "Database error" });

                res.status(201).json({ message: "User registered successfully", userId: this.lastID });
            }
        );
    });
});


// ✅ User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required" });
    }

    // 🔹 Check user credentials
    db.get(
        "SELECT id, name, password, credits FROM users WHERE email = ?",
        [email],
        (err, user) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (!user || user.password !== password) {
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }

            // 🔹 Store session
            req.session.user = {
                id: user.id,
                name: user.name,
                credits: user.credits,
            };
            res.json({
                message: "Login successful",
                userId: user.id,
                name: user.name,
                credits: user.credits,
            });
        },
    );
});

// ✅ User Logout
router.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err)
                return res.status(500).json({ error: "Failed to log out" });
            res.json({ message: "Logged out successfully" });
        });
    } else {
        res.json({ message: "No active session found" });
    }
});

module.exports = router;
