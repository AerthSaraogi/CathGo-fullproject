const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Get User Profile & Credits
router.get("/profile", (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.get("SELECT name, email, phone, country, credits FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    });
});

module.exports = router;
