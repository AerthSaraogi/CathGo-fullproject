const express = require("express");
const db = require("../database/db");

const router = express.Router();

// GET all users (Admin)
router.get("/admin/users", async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            db.all("SELECT id, name, email, phone, country, credits FROM users", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST Increase user credits (Admin)
router.post("/admin/increase-credits/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        await new Promise((resolve, reject) => {
            db.run("UPDATE users SET credits = credits + 10 WHERE id = ?", [userId], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ message: "Credits increased successfully" });
    } catch (error) {
        console.error("Error updating credits:", error);
        res.status(500).json({ error: "Failed to increase credits" });
    }
});

module.exports = router;
