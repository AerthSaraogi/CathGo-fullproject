Cathage

Document Matching System

Overview

This project is a document matching system where:

The admin uploads multiple PDF files to a database.
A user uploads a text file.
The system matches the user's text file with the most relevant PDF document from the uploaded PDFs.
The best-matching document is returned to the user.
Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: Local storage for PDFs (can be extended to a database)
AI Model: OpenAI (ChatGPT) for text similarity matching
Features

1. Admin Panel

Admin can upload multiple PDF files.
Uploaded files are stored in a predefined directory.
Admin can manage users (increase credits, etc.).
2. User Interaction

User logs in and uploads a text file.
The system processes the text file and compares it with stored PDFs.
The best-matching PDF is returned to the user.
3. Authentication

Admin and users login separately.
Admin access redirects to admin.html, while users go to hero.html.
File Structure

Project Root
│── Backend
│   │── database
│   │   ├── db.js
│   │   ├── pdfs/  (Stores uploaded PDFs)
│   │── routes
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   ├── scanRoutes.js
│   │   ├── authRoutes.js
│   │── index.js  (Main server file)
│── Frontend
│   │── hero.html
│   │── login.html
│   │── signup.html
│   │── admin.html
│── README.md
Setup Instructions

1. Install Dependencies

npm install express multer cors openai
2. Run the Server

node index.js
3. Open Frontend Files

Open login.html in a browser.
Login as an admin to upload PDFs.
Login as a user to upload a text file and get the best-matching PDF.
API Endpoints

Admin

POST /api/admin/upload-pdf → Upload a new PDF
GET /api/admin/users → Fetch all users
POST /api/admin/increase-credits/:userId → Increase user credits
User

POST /api/user/upload-text → Upload text for matching
GET /api/user/get-matched-pdf → Get the best matching PDF
Current Status

✅ Admin can upload PDFs.
✅ Users can log in and upload text files.
✅ OpenAI API is used for document matching.
✅ Authentication implemented.
⚡ Future improvements: Store PDFs in a database instead of local storage.
