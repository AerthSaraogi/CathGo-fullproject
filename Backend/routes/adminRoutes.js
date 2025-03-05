const express = require("express");
const router = express.Router();
const db = require("../db"); // Fixed path

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ? AND password = ? AND role = 'admin'", [email, password], (err, admin) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!admin) {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }
        req.admin = admin; // Store admin data for later use
        next();
    });
};

// Get all users (Admin only)
router.get("/users", verifyAdmin, (req, res) => {
    db.all("SELECT id, name, email, phone, country, credits FROM users WHERE role = 'user'", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// Delete a user (Admin only)
router.delete("/users/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    });
});

// Update user details & credits (Admin only)
router.put("/users/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { name, email, phone, country, credits } = req.body;

    db.run("UPDATE users SET name = ?, email = ?, phone = ?, country = ?, credits = ? WHERE id = ?", 
        [name, email, phone, country, credits, id], 
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User updated successfully" });
        });
});

module.exports = router;
