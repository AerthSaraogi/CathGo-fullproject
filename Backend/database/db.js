const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create users table with a credits column
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
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table created or already exists.');

        // Insert default admin only after table creation is confirmed
        const insertAdmin = `INSERT OR IGNORE INTO users (id, name, email, phone, country, password, role, credits) VALUES 
            (1, 'Admin', 'admin@example.com', '1234567890', 'USA', 'admin123', 'admin', 0);`;

        db.run(insertAdmin, (err) => {
            if (err) {
                console.error('Error inserting admin:', err.message);
            } else {
                console.log('Admin user inserted or already exists.');
            }
        });
    }
});

module.exports = db;
