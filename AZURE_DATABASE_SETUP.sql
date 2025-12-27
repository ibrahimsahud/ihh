-- ===============================================
-- IHH Database Schema for Azure SQL / Online Hosting
-- Run this script on your online database
-- ===============================================

-- Use the correct database
USE [IHH_Hayir];
GO

-- ===============================================
-- 1. Drop existing tables (if any)
-- ===============================================

IF OBJECT_ID('OrphanSponsorship', 'U') IS NOT NULL DROP TABLE OrphanSponsorship;
IF OBJECT_ID('AidDistribution', 'U') IS NOT NULL DROP TABLE AidDistribution;
IF OBJECT_ID('Donations', 'U') IS NOT NULL DROP TABLE Donations;
IF OBJECT_ID('Beneficiaries', 'U') IS NOT NULL DROP TABLE Beneficiaries;
IF OBJECT_ID('Donors', 'U') IS NOT NULL DROP TABLE Donors;
IF OBJECT_ID('Staff', 'U') IS NOT NULL DROP TABLE Staff;
IF OBJECT_ID('AidTypes', 'U') IS NOT NULL DROP TABLE AidTypes;
IF OBJECT_ID('Branches', 'U') IS NOT NULL DROP TABLE Branches;
IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
GO

-- ===============================================
-- 2. Create Tables
-- ===============================================

-- Branches Table
CREATE TABLE Branches (
    BranchID INT IDENTITY(1,1) PRIMARY KEY,
    BranchName NVARCHAR(100) NOT NULL,
    City NVARCHAR(50),
    Country NVARCHAR(50) DEFAULT 'Turkey',
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Address NVARCHAR(200),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Donors Table
CREATE TABLE Donors (
    DonorID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    Country NVARCHAR(50) DEFAULT 'Turkey',
    DonorType NVARCHAR(20) CHECK (DonorType IN ('Individual', 'Organization')),
    RegistrationDate DATETIME2 DEFAULT SYSDATETIME(),
    IsActive BIT DEFAULT 1
);

-- Beneficiaries Table
CREATE TABLE Beneficiaries (
    BeneficiaryID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    Country NVARCHAR(50) DEFAULT 'Turkey',
    BeneficiaryType NVARCHAR(20) CHECK (BeneficiaryType IN ('Orphan', 'Widow', 'Disabled', 'Elderly', 'Refugee', 'Poor')),
    FamilySize INT DEFAULT 1,
    MonthlyIncome DECIMAL(18, 2) DEFAULT 0,
    RegistrationDate DATETIME2 DEFAULT SYSDATETIME(),
    IsActive BIT DEFAULT 1
);

-- Staff Table
CREATE TABLE Staff (
    StaffID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Position NVARCHAR(50),
    Department NVARCHAR(50),
    MonthlySalary DECIMAL(18, 2),
    HireDate DATETIME2 DEFAULT SYSDATETIME(),
    IsActive BIT DEFAULT 1
);

-- Donations Table
CREATE TABLE Donations (
    DonationID INT IDENTITY(1,1) PRIMARY KEY,
    DonorID INT NOT NULL,
    BranchID INT NOT NULL,
    DonationAmount DECIMAL(18, 2) NOT NULL,
    DonationCurrency NVARCHAR(10) DEFAULT 'TRY',
    DonationType NVARCHAR(20) CHECK (DonationType IN ('Cash', 'Goods', 'Service')),
    PaymentMethod NVARCHAR(20) CHECK (PaymentMethod IN ('Cash', 'Bank Transfer', 'Credit Card', 'Check')),
    DonationDate DATETIME2 DEFAULT SYSDATETIME(),
    Notes NVARCHAR(500),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
);

-- Aid Types Table
CREATE TABLE AidTypes (
    AidTypeID INT IDENTITY(1,1) PRIMARY KEY,
    AidTypeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200)
);

-- Aid Distribution Table
CREATE TABLE AidDistribution (
    DistributionID INT IDENTITY(1,1) PRIMARY KEY,
    BeneficiaryID INT NOT NULL,
    BranchID INT NOT NULL,
    AidTypeID INT NOT NULL,
    Quantity INT DEFAULT 1,
    EstimatedValue DECIMAL(18, 2),
    DistributionDate DATETIME2 DEFAULT SYSDATETIME(),
    Notes NVARCHAR(500),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID),
    FOREIGN KEY (AidTypeID) REFERENCES AidTypes(AidTypeID)
);

-- Orphan Sponsorship Table
CREATE TABLE OrphanSponsorship (
    SponsorshipID INT IDENTITY(1,1) PRIMARY KEY,
    DonorID INT NOT NULL,
    BeneficiaryID INT NOT NULL,
    MonthlyAmount DECIMAL(18, 2) NOT NULL,
    PaymentFrequency NVARCHAR(20) CHECK (PaymentFrequency IN ('Monthly', 'Quarterly', 'Yearly')),
    StartDate DATETIME2 DEFAULT SYSDATETIME(),
    EndDate DATETIME2,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID)
);

-- Notifications Table
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    Type NVARCHAR(20) NOT NULL DEFAULT 'info',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    IsRead BIT NOT NULL DEFAULT 0
);

GO

-- ===============================================
-- 3. Insert Basic Data
-- ===============================================

-- Insert Branches
INSERT INTO Branches (BranchName, City, Country, PhoneNumber, Email, Address)
VALUES 
    ('IHH Istanbul Merkez', 'Istanbul', 'Turkey', '+90 212 631 2121', 'istanbul@ihh.org.tr', 'Halkalı Merkez Mahallesi'),
    ('IHH Ankara Şubesi', 'Ankara', 'Turkey', '+90 312 555 0101', 'ankara@ihh.org.tr', 'Çankaya'),
    ('IHH İzmir Şubesi', 'Izmir', 'Turkey', '+90 232 555 0102', 'izmir@ihh.org.tr', 'Konak');

-- Insert Aid Types
INSERT INTO AidTypes (AidTypeName, Description)
VALUES 
    ('Food Package', 'Monthly or emergency food packages'),
    ('Clothing', 'Clothing and shoes'),
    ('Education Support', 'School supplies and tuition'),
    ('Medical Aid', 'Medicine and medical treatment'),
    ('Shelter Support', 'Housing and accommodation'),
    ('Cash Assistance', 'Direct cash support'),
    ('Winter Aid', 'Winter clothing and heating support'),
    ('Ramadan Aid', 'Ramadan food packages and iftar');

-- Insert Sample Donors
INSERT INTO Donors (FirstName, LastName, PhoneNumber, Email, City, Country, DonorType)
VALUES 
    ('Ahmet', 'Yılmaz', '+90 532 123 4567', 'ahmet.yilmaz@email.com', 'Istanbul', 'Turkey', 'Individual'),
    ('Fatma', 'Kaya', '+90 533 234 5678', 'fatma.kaya@email.com', 'Ankara', 'Turkey', 'Individual'),
    ('ABC Şirketi', 'Limited', '+90 212 555 0001', 'info@abccompany.com', 'Istanbul', 'Turkey', 'Organization');

-- Insert Sample Beneficiaries
INSERT INTO Beneficiaries (FirstName, LastName, PhoneNumber, City, Country, BeneficiaryType, FamilySize, MonthlyIncome)
VALUES 
    ('Mehmet', 'Demir', '+90 534 345 6789', 'Gaziantep', 'Turkey', 'Orphan', 5, 0),
    ('Ayşe', 'Şahin', '+90 535 456 7890', 'Hatay', 'Turkey', 'Widow', 3, 0),
    ('Ali', 'Çelik', '+90 536 567 8901', 'Adana', 'Turkey', 'Refugee', 6, 0);

-- Insert Sample Staff
INSERT INTO Staff (FirstName, LastName, PhoneNumber, Email, Position, Department, MonthlySalary)
VALUES 
    ('Hasan', 'Öztürk', '+90 537 678 9012', 'hasan.ozturk@ihh.org.tr', 'Manager', 'Administration', 15000),
    ('Zeynep', 'Arslan', '+90 538 789 0123', 'zeynep.arslan@ihh.org.tr', 'Coordinator', 'Aid Distribution', 12000),
    ('Mustafa', 'Aydın', '+90 539 890 1234', 'mustafa.aydin@ihh.org.tr', 'Field Worker', 'Operations', 10000);

-- Insert Sample Donations
INSERT INTO Donations (DonorID, BranchID, DonationAmount, DonationCurrency, DonationType, PaymentMethod, Notes)
VALUES 
    (1, 1, 1000.00, 'TRY', 'Cash', 'Bank Transfer', 'Monthly donation'),
    (2, 2, 500.00, 'TRY', 'Cash', 'Credit Card', 'Ramadan donation'),
    (3, 1, 5000.00, 'TRY', 'Cash', 'Bank Transfer', 'Corporate social responsibility');

-- Insert Sample Aid Distributions
INSERT INTO AidDistribution (BeneficiaryID, BranchID, AidTypeID, Quantity, EstimatedValue, Notes)
VALUES 
    (1, 1, 1, 1, 500.00, 'Monthly food package'),
    (2, 2, 3, 1, 1000.00, 'School supplies for children'),
    (3, 1, 6, 1, 2000.00, 'Emergency cash assistance');

-- Insert Sample Sponsorships
INSERT INTO OrphanSponsorship (DonorID, BeneficiaryID, MonthlyAmount, PaymentFrequency)
VALUES 
    (1, 1, 500.00, 'Monthly'),
    (2, 2, 400.00, 'Monthly');

GO

-- ===============================================
-- 4. Verification
-- ===============================================

PRINT '✅ Database schema created successfully!';
PRINT '';
PRINT 'Table counts:';
SELECT 'Branches' as TableName, COUNT(*) as RecordCount FROM Branches
UNION ALL
SELECT 'Donors', COUNT(*) FROM Donors
UNION ALL
SELECT 'Beneficiaries', COUNT(*) FROM Beneficiaries
UNION ALL
SELECT 'Staff', COUNT(*) FROM Staff
UNION ALL
SELECT 'AidTypes', COUNT(*) FROM AidTypes
UNION ALL
SELECT 'Donations', COUNT(*) FROM Donations
UNION ALL
SELECT 'AidDistribution', COUNT(*) FROM AidDistribution
UNION ALL
SELECT 'OrphanSponsorship', COUNT(*) FROM OrphanSponsorship;

GO

PRINT '';
PRINT '🎉 Setup complete! Your database is ready for production.';
