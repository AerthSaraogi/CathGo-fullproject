const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Request Admin to Add Credits
router.post("/request", (req, res) => {
    const { userId, amount } = req.body;

    // Validate Input
    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid user ID or amount" });
    }

    // Check if User Exists
    db.get("SELECT id FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Insert Credit Request
        db.run(
            "INSERT INTO credit_requests (user_id, amount) VALUES (?, ?)",
            [userId, amount],
            (err) => {
                if (err) return res.status(500).json({ error: "Failed to submit request" });
                res.json({ message: "Credit request submitted successfully" });
            }
        );
    });
});

module.exports = router;
