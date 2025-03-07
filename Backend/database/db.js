// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./database.sqlite', (err) => {
//     if (err) {
//         console.error('Error opening database:', err.message);
//     } else {
//         console.log('Connected to SQLite database.');
//     }
// });

// // Create users table with a credits column
// const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     phone TEXT NOT NULL,
//     country TEXT NOT NULL,
//     password TEXT NOT NULL,
//     role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
//     credits INTEGER NOT NULL DEFAULT 20
// );`;

// db.run(createUsersTable, (err) => {
//     if (err) {
//         console.error('Error creating users table:', err.message);
//     } else {
//         console.log('Users table created or already exists.');

//         // Insert default admin only after table creation is confirmed
//         const insertAdmin = `INSERT OR IGNORE INTO users (id, name, email, phone, country, password, role, credits) VALUES 
//             (1, 'Admin', 'admin@example.com', '1234567890', 'USA', 'admin123', 'admin', 0);`;

//         db.run(insertAdmin, (err) => {
//             if (err) {
//                 console.error('Error inserting admin:', err.message);
//             } else {
//                 console.log('Admin user inserted or already exists.');
//             }
//         });
//     }
// });

// module.exports = db;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create users table
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
    credits INTEGER NOT NULL DEFAULT 20
);`;

db.run(createUsersTable, (err) => {
    if (err) console.error('Error creating users table:', err.message);
    else console.log('Users table created or already exists.');
});

// Insert default admin
const insertAdmin = `INSERT OR IGNORE INTO users (id, name, email, phone, country, password, role, credits) VALUES 
    (1, 'Admin', 'admin@example.com', '1234567890', 'USA', 'admin123', 'admin', 0);`;

db.run(insertAdmin, (err) => {
    if (err) console.error('Error inserting admin:', err.message);
    else console.log('Admin user inserted or already exists.');
});

// Create documents table (stores uploaded PDFs)
const createDocumentsTable = `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL
);`;

db.run(createDocumentsTable, (err) => {
    if (err) console.error('Error creating documents table:', err.message);
    else console.log('Documents table created or already exists.');
});

// Create scans table (tracks document scans per user)
const createScansTable = `CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_id INTEGER NOT NULL,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);`;

db.run(createScansTable, (err) => {
    if (err) console.error('Error creating scans table:', err.message);
    else console.log('Scans table created or already exists.');
});

// Create credit_requests table (users request more credits)
const createCreditRequestsTable = `CREATE TABLE IF NOT EXISTS credit_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'approved', 'denied')) DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

db.run(createCreditRequestsTable, (err) => {
    if (err) console.error('Error creating credit_requests table:', err.message);
    else console.log('Credit Requests table created or already exists.');
});

module.exports = db;
