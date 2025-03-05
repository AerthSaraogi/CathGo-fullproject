const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const db = require("../db");

// Middleware to check if user has enough credits
const checkCredits = (req, res, next) => {
    const { userId } = req.body;

    db.get("SELECT credits FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "User not found" });
        if (row.credits <= 0) return res.status(403).json({ error: "Not enough credits" });

        next(); // Proceed to scanning
    });
};

// Function to match uploaded text with stored PDFs (basic implementation)
const matchTextWithPDFs = (uploadedText) => {
    const pdfDirectory = path.join(__dirname, "../pdfs");
    const pdfFiles = fs.readdirSync(pdfDirectory);

    for (const file of pdfFiles) {
        const pdfPath = path.join(pdfDirectory, file);
        const pdfText = fs.readFileSync(pdfPath, "utf8");

        if (pdfText.includes(uploadedText)) {
            return file; // Return matching PDF file name
        }
    }
    return null; // No match found
};

// Scan route: Deduct 1 credit & perform matching
router.post("/scan", checkCredits, (req, res) => {
    const { userId, fileText } = req.body;

    const matchedFile = matchTextWithPDFs(fileText);

    if (!matchedFile) {
        return res.json({ message: "No matching PDF found.", matchedFile: null });
    }

    // Deduct 1 credit
    db.run("UPDATE users SET credits = credits - 1 WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Scan successful. 1 credit deducted.", matchedFile });
    });
});

// User requests more credits
router.post("/request-credits", (req, res) => {
    const { userId, requestAmount } = req.body;

    db.run("INSERT INTO credit_requests (user_id, amount, status) VALUES (?, ?, 'pending')", 
        [userId, requestAmount], 
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Credit request sent to admin." });
        });
});

module.exports = router;
