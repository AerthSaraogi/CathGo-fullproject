const fs = require("fs");
const path = require("path");
const PDF_STORAGE_PATH = path.join(__dirname, "../uploads/");

// Ensure the uploads directory exists
if (!fs.existsSync(PDF_STORAGE_PATH)) {
    fs.mkdirSync(PDF_STORAGE_PATH, { recursive: true });
}

// Save uploaded file manually
function saveFile(req, callback) {
    let fileData = Buffer.alloc(0);
    const boundary = req.headers["content-type"].split("boundary=")[1];

    req.on("data", (chunk) => {
        fileData = Buffer.concat([fileData, chunk]);
    });

    req.on("end", () => {
        const start = fileData.indexOf("\r\n\r\n") + 4; 
        const end = fileData.lastIndexOf("\r\n------"); 

        const fileContent = fileData.slice(start, end);
        const filePath = path.join(PDF_STORAGE_PATH, "uploaded_file.pdf");

        fs.writeFile(filePath, fileContent, (err) => {
            if (err) return callback(err, null);
            callback(null, filePath);
        });
    });
}

module.exports = { saveFile };
