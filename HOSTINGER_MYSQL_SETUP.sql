-- ===============================================
-- IHH Database Schema for MySQL/MariaDB (Hostinger)
-- نسخة MySQL كاملة للنشر على Hostinger
-- ===============================================

-- حذف قاعدة البيانات القديمة إذا كانت موجودة (اختياري)
-- DROP DATABASE IF EXISTS IHH_Hayir;

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS IHH_Hayir 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- استخدام قاعدة البيانات
USE IHH_Hayir;

-- ===============================================
-- 1. حذف الجداول القديمة (إذا كانت موجودة)
-- ===============================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS OrphanSponsorship;
DROP TABLE IF EXISTS AidDistribution;
DROP TABLE IF EXISTS Donations;
DROP TABLE IF EXISTS Beneficiaries;
DROP TABLE IF EXISTS Donors;
DROP TABLE IF EXISTS Staff;
DROP TABLE IF EXISTS AidTypes;
DROP TABLE IF EXISTS Branches;
DROP TABLE IF EXISTS Notifications;

SET FOREIGN_KEY_CHECKS = 1;

-- ===============================================
-- 2. إنشاء الجداول
-- ===============================================

-- جدول الفروع
CREATE TABLE Branches (
    BranchID INT AUTO_INCREMENT PRIMARY KEY,
    BranchName VARCHAR(100) NOT NULL,
    City VARCHAR(50),
    Country VARCHAR(50) DEFAULT 'Turkey',
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(200),
    IsActive TINYINT(1) DEFAULT 1,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_branch_active (IsActive),
    INDEX idx_branch_city (City)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المتبرعين
CREATE TABLE Donors (
    DonorID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(200),
    City VARCHAR(50),
    Country VARCHAR(50) DEFAULT 'Turkey',
    DonorType VARCHAR(20) CHECK (DonorType IN ('Individual', 'Organization')),
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive TINYINT(1) DEFAULT 1,
    INDEX idx_donor_name (FirstName, LastName),
    INDEX idx_donor_type (DonorType),
    INDEX idx_donor_active (IsActive),
    INDEX idx_donor_city (City)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المستفيدين
CREATE TABLE Beneficiaries (
    BeneficiaryID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20),
    Address VARCHAR(200),
    City VARCHAR(50),
    Country VARCHAR(50) DEFAULT 'Turkey',
    BeneficiaryType VARCHAR(20) CHECK (BeneficiaryType IN ('Orphan', 'Widow', 'Disabled', 'Elderly', 'Refugee', 'Poor')),
    FamilySize INT DEFAULT 1,
    MonthlyIncome DECIMAL(18, 2) DEFAULT 0,
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive TINYINT(1) DEFAULT 1,
    INDEX idx_beneficiary_name (FirstName, LastName),
    INDEX idx_beneficiary_type (BeneficiaryType),
    INDEX idx_beneficiary_active (IsActive),
    INDEX idx_beneficiary_city (City)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الموظفين
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Position VARCHAR(50),
    Department VARCHAR(50),
    MonthlySalary DECIMAL(18, 2),
    HireDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive TINYINT(1) DEFAULT 1,
    INDEX idx_staff_name (FirstName, LastName),
    INDEX idx_staff_position (Position),
    INDEX idx_staff_active (IsActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول التبرعات
CREATE TABLE Donations (
    DonationID INT AUTO_INCREMENT PRIMARY KEY,
    DonorID INT NOT NULL,
    BranchID INT NOT NULL,
    DonationAmount DECIMAL(18, 2) NOT NULL,
    DonationCurrency VARCHAR(10) DEFAULT 'TRY',
    DonationType VARCHAR(20) CHECK (DonationType IN ('Cash', 'Goods', 'Service')),
    PaymentMethod VARCHAR(20) CHECK (PaymentMethod IN ('Cash', 'Bank Transfer', 'Credit Card', 'Check')),
    DonationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    INDEX idx_donation_donor (DonorID),
    INDEX idx_donation_branch (BranchID),
    INDEX idx_donation_date (DonationDate),
    INDEX idx_donation_type (DonationType),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول أنواع المساعدات
CREATE TABLE AidTypes (
    AidTypeID INT AUTO_INCREMENT PRIMARY KEY,
    AidTypeName VARCHAR(50) NOT NULL UNIQUE,
    Description VARCHAR(200),
    INDEX idx_aidtype_name (AidTypeName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول توزيع المساعدات
CREATE TABLE AidDistribution (
    DistributionID INT AUTO_INCREMENT PRIMARY KEY,
    BeneficiaryID INT NOT NULL,
    BranchID INT NOT NULL,
    AidTypeID INT NOT NULL,
    Quantity INT DEFAULT 1,
    EstimatedValue DECIMAL(18, 2),
    DistributionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    INDEX idx_distribution_beneficiary (BeneficiaryID),
    INDEX idx_distribution_branch (BranchID),
    INDEX idx_distribution_aidtype (AidTypeID),
    INDEX idx_distribution_date (DistributionDate),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (AidTypeID) REFERENCES AidTypes(AidTypeID) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول كفالة الأيتام
CREATE TABLE OrphanSponsorship (
    SponsorshipID INT AUTO_INCREMENT PRIMARY KEY,
    DonorID INT NOT NULL,
    BeneficiaryID INT NOT NULL,
    MonthlyAmount DECIMAL(18, 2) NOT NULL,
    PaymentFrequency VARCHAR(20) CHECK (PaymentFrequency IN ('Monthly', 'Quarterly', 'Yearly')),
    StartDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    EndDate DATETIME,
    IsActive TINYINT(1) DEFAULT 1,
    INDEX idx_sponsorship_donor (DonorID),
    INDEX idx_sponsorship_beneficiary (BeneficiaryID),
    INDEX idx_sponsorship_active (IsActive),
    FOREIGN KEY (DonorID) REFERENCES Donors(DonorID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiaries(BeneficiaryID) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الإشعارات
CREATE TABLE Notifications (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Message VARCHAR(500) NOT NULL,
    Type VARCHAR(20) NOT NULL DEFAULT 'info',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead TINYINT(1) NOT NULL DEFAULT 0,
    INDEX idx_notification_read (IsRead),
    INDEX idx_notification_date (CreatedAt),
    INDEX idx_notification_type (Type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 3. إدراج البيانات الأساسية
-- ===============================================

-- إضافة الفروع
INSERT INTO Branches (BranchName, City, Country, PhoneNumber, Email, Address) VALUES
('IHH Istanbul Merkez', 'Istanbul', 'Turkey', '+90 212 631 2121', 'istanbul@ihh.org.tr', 'Halkalı Merkez Mahallesi'),
('IHH Ankara Şubesi', 'Ankara', 'Turkey', '+90 312 555 0101', 'ankara@ihh.org.tr', 'Çankaya'),
('IHH İzmir Şubesi', 'Izmir', 'Turkey', '+90 232 555 0102', 'izmir@ihh.org.tr', 'Konak'),
('IHH Gaziantep Şubesi', 'Gaziantep', 'Turkey', '+90 342 555 0103', 'gaziantep@ihh.org.tr', 'Şahinbey'),
('IHH Konya Şubesi', 'Konya', 'Turkey', '+90 332 555 0104', 'konya@ihh.org.tr', 'Meram');

-- إضافة أنواع المساعدات
INSERT INTO AidTypes (AidTypeName, Description) VALUES
('Food Package', 'Monthly or emergency food packages'),
('Clothing', 'Clothing and shoes for all ages'),
('Education Support', 'School supplies, books, and tuition assistance'),
('Medical Aid', 'Medicine, medical equipment, and treatment'),
('Shelter Support', 'Housing assistance and accommodation'),
('Cash Assistance', 'Direct cash support for urgent needs'),
('Winter Aid', 'Winter clothing, blankets, and heating support'),
('Ramadan Aid', 'Ramadan food packages and iftar meals'),
('Water Well', 'Construction of water wells'),
('Orphan Support', 'Monthly support for orphaned children');

-- إضافة متبرعين نموذجيين
INSERT INTO Donors (FirstName, LastName, PhoneNumber, Email, City, Country, DonorType) VALUES
('Ahmet', 'Yılmaz', '+90 532 123 4567', 'ahmet.yilmaz@email.com', 'Istanbul', 'Turkey', 'Individual'),
('Fatma', 'Kaya', '+90 533 234 5678', 'fatma.kaya@email.com', 'Ankara', 'Turkey', 'Individual'),
('Mehmet', 'Demir', '+90 534 345 6789', 'mehmet.demir@email.com', 'Izmir', 'Turkey', 'Individual'),
('Ayşe', 'Şahin', '+90 535 456 7890', 'ayse.sahin@email.com', 'Bursa', 'Turkey', 'Individual'),
('Ali', 'Çelik', '+90 536 567 8901', 'ali.celik@email.com', 'Antalya', 'Turkey', 'Individual'),
('ABC Şirketi', 'Limited', '+90 212 555 0001', 'info@abccompany.com', 'Istanbul', 'Turkey', 'Organization'),
('XYZ Holding', 'A.Ş.', '+90 312 555 0002', 'info@xyzholding.com', 'Ankara', 'Turkey', 'Organization'),
('Hayır Derneği', 'Vakfı', '+90 232 555 0003', 'info@hayirvakfi.com', 'Izmir', 'Turkey', 'Organization');

-- إضافة مستفيدين نموذجيين
INSERT INTO Beneficiaries (FirstName, LastName, PhoneNumber, City, Country, BeneficiaryType, FamilySize, MonthlyIncome) VALUES
('Zeynep', 'Arslan', '+90 537 678 9012', 'Gaziantep', 'Turkey', 'Orphan', 5, 0.00),
('Hasan', 'Öztürk', '+90 538 789 0123', 'Hatay', 'Turkey', 'Widow', 3, 500.00),
('Mustafa', 'Aydın', '+90 539 890 1234', 'Adana', 'Turkey', 'Refugee', 6, 0.00),
('Emine', 'Yıldız', '+90 540 901 2345', 'Şanlıurfa', 'Turkey', 'Poor', 4, 800.00),
('Abdullah', 'Kara', '+90 541 012 3456', 'Mardin', 'Turkey', 'Disabled', 2, 1200.00),
('Elif', 'Koç', '+90 542 123 4567', 'Kilis', 'Turkey', 'Orphan', 3, 0.00),
('Yusuf', 'Aksoy', '+90 543 234 5678', 'Gaziantep', 'Turkey', 'Elderly', 1, 1500.00),
('Hatice', 'Güneş', '+90 544 345 6789', 'Hatay', 'Turkey', 'Widow', 5, 600.00);

-- إضافة موظفين نموذجيين
INSERT INTO Staff (FirstName, LastName, PhoneNumber, Email, Position, Department, MonthlySalary) VALUES
('Hasan', 'Öztürk', '+90 545 678 9012', 'hasan.ozturk@ihh.org.tr', 'Manager', 'Administration', 15000.00),
('Zeynep', 'Arslan', '+90 546 789 0123', 'zeynep.arslan@ihh.org.tr', 'Coordinator', 'Aid Distribution', 12000.00),
('Mustafa', 'Aydın', '+90 547 890 1234', 'mustafa.aydin@ihh.org.tr', 'Field Worker', 'Operations', 10000.00),
('Ayşe', 'Yıldız', '+90 548 901 2345', 'ayse.yildiz@ihh.org.tr', 'Accountant', 'Finance', 13000.00),
('Mehmet', 'Kara', '+90 549 012 3456', 'mehmet.kara@ihh.org.tr', 'Driver', 'Logistics', 9000.00),
('Fatma', 'Koç', '+90 550 123 4567', 'fatma.koc@ihh.org.tr', 'Social Worker', 'Aid Distribution', 11000.00);

-- إضافة تبرعات نموذجية
INSERT INTO Donations (DonorID, BranchID, DonationAmount, DonationCurrency, DonationType, PaymentMethod, Notes) VALUES
(1, 1, 1000.00, 'TRY', 'Cash', 'Bank Transfer', 'Monthly donation - Regular donor'),
(2, 2, 500.00, 'TRY', 'Cash', 'Credit Card', 'Ramadan donation'),
(3, 1, 750.00, 'TRY', 'Cash', 'Cash', 'One-time donation'),
(4, 3, 2000.00, 'TRY', 'Cash', 'Bank Transfer', 'For orphan sponsorship'),
(5, 1, 300.00, 'TRY', 'Cash', 'Credit Card', 'Winter aid donation'),
(6, 1, 5000.00, 'TRY', 'Cash', 'Bank Transfer', 'Corporate social responsibility - ABC Company'),
(7, 2, 3000.00, 'TRY', 'Cash', 'Bank Transfer', 'Annual corporate donation'),
(8, 1, 1500.00, 'TRY', 'Goods', 'Cash', 'Food and clothing donation'),
(1, 1, 1000.00, 'TRY', 'Cash', 'Bank Transfer', 'Monthly donation - Month 2'),
(2, 2, 500.00, 'TRY', 'Cash', 'Credit Card', 'Monthly donation');

-- إضافة توزيع مساعدات نموذجية
INSERT INTO AidDistribution (BeneficiaryID, BranchID, AidTypeID, Quantity, EstimatedValue, Notes) VALUES
(1, 1, 1, 1, 500.00, 'Monthly food package for family of 5'),
(2, 2, 3, 1, 1000.00, 'School supplies for 3 children'),
(3, 1, 6, 1, 2000.00, 'Emergency cash assistance for refugee family'),
(4, 3, 1, 1, 400.00, 'Monthly food package'),
(5, 1, 4, 1, 1500.00, 'Medical treatment and medication'),
(6, 1, 10, 1, 800.00, 'Monthly orphan support'),
(7, 2, 5, 1, 3000.00, 'Rental assistance for 3 months'),
(8, 2, 7, 5, 2500.00, 'Winter clothing and blankets for family'),
(1, 1, 2, 4, 800.00, 'Clothing for children'),
(2, 2, 8, 1, 600.00, 'Ramadan food package');

-- إضافة كفالات أيتام نموذجية
INSERT INTO OrphanSponsorship (DonorID, BeneficiaryID, MonthlyAmount, PaymentFrequency) VALUES
(1, 1, 500.00, 'Monthly'),
(2, 2, 400.00, 'Monthly'),
(4, 6, 600.00, 'Monthly'),
(6, 1, 1000.00, 'Quarterly'),
(7, 6, 1500.00, 'Yearly');

-- إضافة إشعارات نموذجية
INSERT INTO Notifications (Title, Message, Type) VALUES
('مرحباً بك في نظام IHH', 'تم تفعيل النظام بنجاح', 'success'),
('قاعدة البيانات جاهزة', 'تم إنشاء جميع الجداول والبيانات الأساسية', 'success'),
('تذكير', 'لا تنسَ مراجعة التبرعات الشهرية', 'info'),
('تنبيه', 'يوجد 3 كفالات أيتام تحتاج للمتابعة', 'warning');

-- ===============================================
-- 4. التحقق من البيانات
-- ===============================================

SELECT '✅ تم إنشاء قاعدة البيانات بنجاح!' AS Status;

SELECT 'عدد السجلات في كل جدول:' AS Info;

SELECT 
    'Branches' AS TableName, 
    COUNT(*) AS RecordCount 
FROM Branches
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
SELECT 'OrphanSponsorship', COUNT(*) FROM OrphanSponsorship
UNION ALL
SELECT 'Notifications', COUNT(*) FROM Notifications;

-- ===============================================
-- 5. معلومات مهمة
-- ===============================================

SELECT '🎉 Setup complete! قاعدة البيانات جاهزة للاستخدام' AS FinalMessage;
SELECT 'Database Name: IHH_Hayir' AS Info;
SELECT 'Total Tables: 9' AS Info;
SELECT 'Ready for production deployment on Hostinger!' AS Status;
