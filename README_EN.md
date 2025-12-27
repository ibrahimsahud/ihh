# 🌟 IHH Charity Management System

A comprehensive management system for IHH Humanitarian Relief Foundation to manage donations, beneficiaries, staff, and aid distribution.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MSSQL](https://img.shields.io/badge/Database-MS%20SQL%20Server-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

Visit: http://localhost:3000

---

## 🌐 Deployment Guide

### Prerequisites
- GitHub account
- Render.com account (free)
- Azure SQL Database or FreeSQLDatabase.com account

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ihh.git
git push -u origin main
```

### Step 2: Create Free Database

**Option A: Azure SQL Database** (Recommended)
- Visit: https://portal.azure.com
- Create SQL Database
- Choose Basic tier
- Note connection details

**Option B: FreeSQLDatabase.com**
- Visit: http://www.freesqldatabase.com
- Sign up and create database
- Get connection credentials

### Step 3: Deploy to Render.com

1. Go to: https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Select your repository
5. Settings:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

6. Add Environment Variables:
   ```
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_SERVER=your_server.database.windows.net
   DB_NAME=IHH_Hayir
   DB_ENCRYPT=true
   DB_TRUST_CERT=true
   NODE_ENV=production
   PORT=10000
   ```

7. Click "Create Web Service"

### Step 4: Setup Database

Run `AZURE_DATABASE_SETUP.sql` on your online database using Azure Data Studio or SSMS.

---

## 📁 Project Structure

```
ihh-vt/
├── public/               # Frontend files
│   ├── index.html       # Main page
│   ├── admin-login.html # Admin login
│   ├── script.js        # Frontend logic
│   └── style.css        # Styles
├── server.js            # Express server
├── database.js          # Database configuration
├── CREATE_TABLES.sql    # Database schema
├── AZURE_DATABASE_SETUP.sql  # Azure setup script
└── package.json         # Dependencies
```

---

## ✨ Features

- ✅ **Donor Management** - Track individual and organization donors
- ✅ **Donation Tracking** - Record and manage all donations
- ✅ **Beneficiary Management** - Manage orphans, widows, refugees, etc.
- ✅ **Aid Distribution** - Track food, clothing, medical aid distribution
- ✅ **Staff Management** - Manage employees and payroll
- ✅ **Orphan Sponsorship** - Monthly sponsorship programs
- ✅ **Reports & Analytics** - Comprehensive reporting system
- ✅ **Notifications** - Real-time system notifications
- ✅ **Multi-branch Support** - Manage multiple branches

---

## 🛠️ Technology Stack

- **Backend:** Node.js + Express.js
- **Database:** Microsoft SQL Server
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Hosting:** Render.com (Backend) + Azure SQL (Database)

---

## 📊 Database Schema

Main tables:
- `Branches` - Organization branches
- `Donors` - Donor information
- `Donations` - Donation records
- `Beneficiaries` - People receiving aid
- `AidDistribution` - Aid distribution records
- `Staff` - Employee information
- `OrphanSponsorship` - Sponsorship programs
- `AidTypes` - Types of aid available

---

## 🔒 Security

- Environment variables for sensitive data
- SQL injection prevention using parameterized queries
- HTTPS encryption on production
- CORS enabled for API security

---

## 📝 Environment Variables

Create `.env` file (for local development):

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_NAME=IHH_Hayir
DB_ENCRYPT=true
DB_TRUST_CERT=true
PORT=3000
NODE_ENV=development
```

---

## 🚦 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Record new donation

### Beneficiaries
- `GET /api/beneficiaries` - Get all beneficiaries
- `POST /api/beneficiaries` - Add new beneficiary
- `PUT /api/beneficiaries/:id` - Update beneficiary
- `DELETE /api/beneficiaries/:id` - Delete beneficiary

### Aid Distribution
- `GET /api/aid-distributions` - Get all distributions
- `POST /api/aid-distributions` - Record new distribution

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add new staff member
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Sponsorships
- `GET /api/sponsorships` - Get all sponsorships
- `POST /api/sponsorships` - Create new sponsorship

### Reports
- `GET /api/reports` - Get comprehensive reports

---

## 👥 Authors

- **Ibrahim Sahud** - ibrahim.sahud@ogr.dpu.edu.tr (ID: 202013172164)
- **Ahmet Kassas** - ahmet.kassas@ogr.dpu.edu.tr (ID: 112113172064)

**University:** Dumlupinar University  
**Course:** Database Management - 131725123

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For detailed deployment instructions in Turkish, see:
- [دليل_النشر_الكامل.md](دليل_النشر_الكامل.md) - Complete deployment guide (Arabic)
- [البدء_السريع.md](البدء_السريع.md) - Quick start guide (Arabic)

---

## 🙏 Acknowledgments

- IHH Humanitarian Relief Foundation
- Dumlupinar University
- All contributors and supporters

---

**Made with ❤️ for humanitarian aid**
