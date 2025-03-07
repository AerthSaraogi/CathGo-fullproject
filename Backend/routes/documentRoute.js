const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { saveFile } = require("../utils/upload");
const { extractTextFromPDF } = require("../utils/documentUtils");
const { matchWithStoredDocuments } = require("../utils/embeddingUtils");

// Admin uploads PDFs manually
router.post("/upload", (req, res) => {
    saveFile(req, (err, filePath) => {
        if (err) return res.status(500).json({ error: "File upload failed" });

        db.run("INSERT INTO documents (filename, filepath) VALUES (?, ?)", ["uploaded_file.pdf", filePath], (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "PDF uploaded successfully", filename: "uploaded_file.pdf" });
        });
    });
});

// User uploads text file for matching
router.post("/match", (req, res) => {
    saveFile(req, async (err, filePath) => {
        if (err) return res.status(500).json({ error: "File upload failed" });

        const userText = fs.readFileSync(filePath, "utf-8");
        const bestMatch = await matchWithStoredDocuments(userText);

        res.json({ bestMatch: bestMatch || "No matching document found" });
    });
});

module.exports = router;
