const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get user details
router.get("/:userId", (req, res) => {
    const { userId } = req.params;

    db.get("SELECT id, name, email, phone, country, credits FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    });
});
// Get logged-in user details
router.get("/me", (req, res) => {
    const userId = req.query.userId; // ✅ Get from query parameter

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    db.get("SELECT id, name, email, phone, country, credits FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    });
});



// Update user profile
router.put("/:userId", (req, res) => {
    const { userId } = req.params;
    const { name, email, phone, country } = req.body;

    db.run(
        "UPDATE users SET name = ?, email = ?, phone = ?, country = ? WHERE id = ?",
        [name, email, phone, country, userId],
        function (err) {
            if (err) return res.status(500).json({ error: "Database error" });
            if (this.changes === 0) return res.status(404).json({ error: "User not found" });

            res.json({ message: "Profile updated successfully" });
        }
    );
});

// Check user credits
router.get("/:userId/credits", (req, res) => {
    const { userId } = req.params;

    db.get("SELECT credits FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "User not found" });

        res.json({ credits: row.credits });
    });
});

// Change password
router.put("/:userId/change-password", (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    db.get("SELECT password FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.password !== oldPassword) return res.status(403).json({ error: "Incorrect old password" });

        db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId], function (err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Password updated successfully" });
        });
    });
});

module.exports = router;
