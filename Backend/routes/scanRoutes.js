const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Upload Document for Scanning (Uses 1 Credit)
router.post("/upload", (req, res) => {
    const { userId, documentName, topic } = req.body;

    if (!userId || !documentName || !topic) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.get("SELECT credits FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.credits <= 0) return res.status(400).json({ error: "Insufficient credits" });

        // Start a transaction to ensure atomicity
        db.run("BEGIN TRANSACTION", (err) => {
            if (err) return res.status(500).json({ error: err.message });

            db.run(
                "INSERT INTO scans (user_id, document_name, topic, credits_used) VALUES (?, ?, ?, 1)",
                [userId, documentName, topic],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK"); // Revert changes if insert fails
                        return res.status(500).json({ error: err.message });
                    }

                    db.run("UPDATE users SET credits = credits - 1 WHERE id = ?", [userId], (err) => {
                        if (err) {
                            db.run("ROLLBACK");
                            return res.status(500).json({ error: err.message });
                        }

                        db.run("COMMIT", () => {
                            res.json({ message: "Document uploaded successfully", scanId: this.lastID });
                        });
                    });
                }
            );
        });
    });
});

// Get Matching Documents
router.get("/matches/:docId", (req, res) => {
    const { docId } = req.params;

    if (!docId) return res.status(400).json({ error: "Document ID is required" });

    // Fetch matching documents (Mock for now, replace with real logic)
    res.json({ matches: [`Match1 for Doc ${docId}`, `Match2 for Doc ${docId}`] });
});

module.exports = router;
