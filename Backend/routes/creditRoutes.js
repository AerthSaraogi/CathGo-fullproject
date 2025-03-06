const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Middleware to check user credits before scanning
const checkCredits = (req, res, next) => {
    const { userId } = req.body;

    db.get('SELECT credits FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'User not found' });
        if (row.credits <= 0) return res.status(403).json({ error: 'Not enough credits' });

        req.userCredits = row.credits; // Store user credits for later use
        next(); // Allow scan
    });
};

// Reduce credits after a successful scan
router.post('/scan', checkCredits, (req, res) => {
    const { userId, fileText } = req.body;

    // Perform text matching with stored PDFs (placeholder logic)
    db.all('SELECT id, file_content FROM pdf_files', [], (err, files) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        let matchedFile = null;
        for (const file of files) {
            if (file.file_content.includes(fileText)) {
                matchedFile = file;
                break;
            }
        }

        if (!matchedFile) return res.json({ message: 'No matching document found.' });

        // Deduct 1 credit only if match is found
        db.run('UPDATE users SET credits = credits - 1 WHERE id = ?', [userId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            res.json({
                message: 'Scan successful. 1 credit deducted.',
                matchedFileId: matchedFile.id
            });
        });
    });
});

// User requests more credits
router.post('/request-credits', (req, res) => {
    const { userId, requestAmount } = req.body;

    db.run('INSERT INTO credit_requests (user_id, amount, status) VALUES (?, ?, ?)', 
        [userId, requestAmount, 'pending'], 
        (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Credit request sent to admin.' });
        });
});

module.exports = router;
