const fs = require("fs");
const path = require("path");

const PDF_STORAGE_PATH = path.join(__dirname, "../uploads/");

// Ensure the uploads directory exists
if (!fs.existsSync(PDF_STORAGE_PATH)) {
    fs.mkdirSync(PDF_STORAGE_PATH, { recursive: true });
}

// Save PDF file
function savePDF(file) {
    const filePath = path.join(PDF_STORAGE_PATH, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    return filePath;
}

// Extract text (Simple read operation, replace with advanced parsing if needed)
function extractTextFromPDF(pdfPath) {
    return fs.readFileSync(pdfPath, "utf-8"); // Simulating text extraction
}

module.exports = { savePDF, extractTextFromPDF, PDF_STORAGE_PATH };
