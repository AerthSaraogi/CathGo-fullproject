const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get logged-in user details
router.get("/:userId", (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    db.get("SELECT id, name, email, phone, country, credits FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    });
});

module.exports = router;
