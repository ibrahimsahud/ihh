-- ======================================
-- IHH Charity Management System - Database Schema
-- MSSQL Server Database
-- تم التطوير بواسطة: إبراهيم شحود وأحمد قشاش
-- جامعة دوملوبينار - 2025
-- ======================================

-- إنشاء قاعدة البيانات
CREATE DATABASE IHH_Hayir;
GO

USE IHH_Hayir;
GO

-- ======================================
-- 1. جدول الفروع (Branches)
-- ======================================
CREATE TABLE Branches (
    BranchID INT PRIMARY KEY IDENTITY(1,1),
    BranchName NVARCHAR(100) NOT NULL,
    BranchCity NVARCHAR(50) NOT NULL,
    BranchAddress NVARCHAR(200),
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- ======================================
-- 2. جدول المتبرعين (Donors)
-- ======================================
CREATE TABLE Donors (
    DonorID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    Country NVARCHAR(50),
    DonorType NVARCHAR(20) CHECK (DonorType IN ('Individual', 'Corporate', 'Foundation')),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- ======================================
-- 3. جدول أنواع المساعدات (Aid Types)
-- ======================================
CREATE TABLE AidTypes (
    AidTypeID INT PRIMARY KEY IDENTITY(1,1),
    AidTypeName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Category NVARCHAR(50) CHECK (Category IN ('Food', 'Medical', 'Education', 'Housing', 'Emergency', 'Other')),
    IsActive BIT DEFAULT 1
);

-- ======================================
-- 4. جدول التبرعات (Donations)
-- ======================================
CREATE TABLE Donations (
    DonationID INT PRIMARY KEY IDENTITY(1,1),
    DonorID INT NOT NULL,
    BranchID INT NOT NULL,
    DonationAmount DECIMAL(18,2) NOT NULL,
    DonationCurrency NVARCHAR(10) DEFAULT 'TRY',
    DonationDate DATETIME DEFAULT GETDATE(),
    DonationType NVARCHAR(20) CHECK (DonationType IN ('Cash', 'InKind', 'Online')),
    PaymentMethod NVARCHAR(20) CHECK (PaymentMethod IN ('Cash', 'Card', 'BankTransfer', 'Online')),
    ReceiptNumber NVARCHAR(50),
    Notes NVARCHAR(500),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
);

-- ======================================
-- 5. جدول المستفيدين (Beneficiaries)
-- ======================================
CREATE TABLE Beneficiaries (
    BeneficiaryID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE,
    Gender NVARCHAR(10) CHECK (Gender IN ('Male', 'Female')),
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    Country NVARCHAR(50),
    FamilySize INT,
    MonthlyIncome DECIMAL(18,2),
    BeneficiaryType NVARCHAR(20) CHECK (BeneficiaryType IN ('Orphan', 'Widow', 'Disabled', 'Refugee', 'Poor', 'Other')),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- ======================================
-- 6. جدول توزيع المساعدات (Aid Distribution)
-- ======================================
CREATE TABLE AidDistribution (
    DistributionID INT PRIMARY KEY IDENTITY(1,1),
    BeneficiaryID INT NOT NULL,
    AidTypeID INT NOT NULL,
    BranchID INT NOT NULL,
    DistributionDate DATETIME DEFAULT GETDATE(),
    Quantity DECIMAL(18,2),
    EstimatedValue DECIMAL(18,2),
    Notes NVARCHAR(500),
    DeliveredBy NVARCHAR(100),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID),
    FOREIGN KEY (AidTypeID) REFERENCES AidTypes(AidTypeID),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
);

-- ======================================
-- 7. جدول الموظفين (Staff)
-- ======================================
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Position NVARCHAR(50),
    Department NVARCHAR(50),
    BranchID INT,
    HireDate DATE,
    MonthlySalary DECIMAL(18,2),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
);

-- ======================================
-- 8. جدول المدفوعات (Payments)
-- ======================================
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentAmount DECIMAL(18,2) NOT NULL,
    PaymentPeriod NVARCHAR(20), -- مثال: 'January 2025'
    PaymentMethod NVARCHAR(20) CHECK (PaymentMethod IN ('Cash', 'BankTransfer', 'Check')),
    Notes NVARCHAR(500),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- ======================================
-- 9. جدول كفالة الأيتام (Orphan Sponsorship)
-- ======================================
CREATE TABLE OrphanSponsorship (
    SponsorshipID INT PRIMARY KEY IDENTITY(1,1),
    DonorID INT NOT NULL,
    BeneficiaryID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    MonthlyAmount DECIMAL(18,2) NOT NULL,
    PaymentFrequency NVARCHAR(20) CHECK (PaymentFrequency IN ('Monthly', 'Quarterly', 'Annually')),
    IsActive BIT DEFAULT 1,
    Notes NVARCHAR(500),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID)
);

-- ======================================
-- 10. جدول المشاريع (Projects)
-- ======================================
CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY IDENTITY(1,1),
    ProjectName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(1000),
    BranchID INT,
    StartDate DATE,
    EndDate DATE,
    TotalBudget DECIMAL(18,2),
    SpentAmount DECIMAL(18,2) DEFAULT 0,
    ProjectStatus NVARCHAR(20) CHECK (ProjectStatus IN ('Planning', 'Active', 'Completed', 'Cancelled')),
    Country NVARCHAR(50),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
);

-- ======================================
-- إنشاء Views مفيدة للتقارير
-- ======================================

-- عرض إجمالي التبرعات حسب المتبرع
CREATE VIEW vw_DonorTotalDonations AS
SELECT 
    d.DonorID,
    d.FirstName + ' ' + d.LastName AS DonorName,
    COUNT(dn.DonationID) AS TotalDonations,
    SUM(dn.DonationAmount) AS TotalAmount,
    d.PhoneNumber,
    d.Email
FROM Donors d
LEFT JOIN Donations dn ON d.DonorID = dn.DonorID
GROUP BY d.DonorID, d.FirstName, d.LastName, d.PhoneNumber, d.Email;
GO

-- عرض المساعدات الموزعة حسب المستفيد
CREATE VIEW vw_BeneficiaryAidHistory AS
SELECT 
    b.BeneficiaryID,
    b.FirstName + ' ' + b.LastName AS BeneficiaryName,
    b.BeneficiaryType,
    COUNT(ad.DistributionID) AS TotalAidsReceived,
    SUM(ad.EstimatedValue) AS TotalValueReceived
FROM Beneficiaries b
LEFT JOIN AidDistribution ad ON b.BeneficiaryID = ad.BeneficiaryID
GROUP BY b.BeneficiaryID, b.FirstName, b.LastName, b.BeneficiaryType;
GO

-- عرض ملخص المدفوعات للموظفين
CREATE VIEW vw_StaffPaymentSummary AS
SELECT 
    s.StaffID,
    s.FirstName + ' ' + s.LastName AS StaffName,
    s.Position,
    s.MonthlySalary,
    COUNT(p.PaymentID) AS PaymentCount,
    SUM(p.PaymentAmount) AS TotalPaid
FROM Staff s
LEFT JOIN Payments p ON s.StaffID = p.StaffID
GROUP BY s.StaffID, s.FirstName, s.LastName, s.Position, s.MonthlySalary;
GO

-- ======================================
-- إدخال بيانات تجريبية
-- ======================================

-- إضافة فروع
INSERT INTO Branches (BranchName, BranchCity, BranchAddress, PhoneNumber, Email) VALUES
('فرع اسطنبول الرئيسي', 'Istanbul', 'Fatih, Istanbul', '+90 212 123 4567', 'istanbul@ihh.org.tr'),
('فرع أنقرة', 'Ankara', 'Çankaya, Ankara', '+90 312 234 5678', 'ankara@ihh.org.tr'),
('فرع بورصة', 'Bursa', 'Osmangazi, Bursa', '+90 224 345 6789', 'bursa@ihh.org.tr');

-- إضافة متبرعين
INSERT INTO Donors (FirstName, LastName, PhoneNumber, Email, City, Country, DonorType) VALUES
('أحمد', 'يلماز', '+90 532 111 2233', 'ahmed.yilmaz@email.com', 'Istanbul', 'Turkey', 'Individual'),
('فاطمة', 'كايا', '+90 533 222 3344', 'fatma.kaya@email.com', 'Ankara', 'Turkey', 'Individual'),
('شركة النور', 'للتجارة', '+90 212 333 4455', 'info@alnour.com', 'Istanbul', 'Turkey', 'Corporate');

-- إضافة أنواع المساعدات
INSERT INTO AidTypes (AidTypeName, Description, Category) VALUES
('سلة غذائية', 'سلة غذائية شهرية تحتوي على مواد أساسية', 'Food'),
('أدوية ومستلزمات طبية', 'أدوية ومعدات طبية للمرضى', 'Medical'),
('مستلزمات مدرسية', 'حقيبة مدرسية وقرطاسية', 'Education'),
('مساعدة نقدية طارئة', 'مساعدة مالية للحالات الطارئة', 'Emergency');

PRINT 'تم إنشاء قاعدة البيانات بنجاح!';