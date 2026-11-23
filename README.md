# Restaurant Management System

Simple, modern, and professional Restaurant Management Web Application built with **Angular 21**, **Node.js (Express)**, and **MySQL**, structured for future **Docker & Docker Compose** integration.

## Project Structure

```text
restaurant-management/
├── database/
│   └── init.sql
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── angular.json
    ├── package.json
    └── src/
        ├── app/
        │   ├── components/
        │   ├── models/
        │   └── services/
        ├── index.html
        ├── main.ts
        └── styles.css
```

## Quick Start

### 1. Database (MySQL)
Import `database/init.sql` into your local MySQL server:
```bash
mysql -u root -p < database/init.sql
```

### 2. Backend (Node.js + Express)
Update `backend/.env` with your MySQL credentials, then run:
```bash
cd backend
npm install
npm run dev
```
Verify backend health at: `http://localhost:3000/health`

### 3. Frontend (Angular 21)
```bash
cd frontend
npm install
npm start
```
Open `http://localhost:4200` in your browser.
