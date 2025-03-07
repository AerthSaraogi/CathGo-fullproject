const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all users details
router.get("/users", (req, res) => {
    db.all("SELECT id, name, email, phone, country, credits,role FROM users WHERE role = 'user'", (err, users) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(users);
    });
});


// Get admin details
// router.get("/:adminId", (req, res) => {
//     const { adminId } = req.params;

//     if (!adminId) {
//         return res.status(401).json({ error: "Unauthorized" });
//     }

//     db.get("SELECT id, name, email FROM users WHERE id = ? AND role = 'admin'", [adminId], (err, admin) => {
//         if (err) return res.status(500).json({ error: "Database error" });
//         if (!admin) return res.status(404).json({ error: "Admin not found" });

//         res.json(admin);
//     });
// });

module.exports = router;
