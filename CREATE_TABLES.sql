-- ======================================
-- Calistirma adimlari:
-- 1. SSMS (SQL Server Management Studio) uygulamasini acin.
-- 2. IBOO sunucusuna baglanin.
-- 3. Bu dosyayi F5 ile calistirin.
-- ======================================

USE IHH_Hayir;
GO

-- ======================================
-- 1. Sube tablosu (Branches)
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
-- 2. Bagisci tablosu (Donors)
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
-- 3. Yardim turleri tablosu (Aid Types)
-- ======================================
CREATE TABLE AidTypes (
    AidTypeID INT PRIMARY KEY IDENTITY(1,1),
    AidTypeName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Category NVARCHAR(50) CHECK (Category IN ('Food', 'Medical', 'Education', 'Housing', 'Emergency', 'Other')),
    IsActive BIT DEFAULT 1
);

-- ======================================
-- 4. Bagis tablosu (Donations)
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
-- 5. Faydalanici tablosu (Beneficiaries)
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
-- 6. Yardim dagitim tablosu (Aid Distribution)
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
-- 7. Personel tablosu (Staff)
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
-- 8. Odeme tablosu (Payments)
-- ======================================
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    StaffID INT NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentAmount DECIMAL(18,2) NOT NULL,
    PaymentPeriod NVARCHAR(20),
    PaymentMethod NVARCHAR(20) CHECK (PaymentMethod IN ('Cash', 'BankTransfer', 'Check')),
    Notes NVARCHAR(500),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- ======================================
-- 9. Yetim sponsorlugu tablosu (Orphan Sponsorship)
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
-- 10. Proje tablosu (Projects)
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
-- Ornek veri (en az bir sube)
-- ======================================
INSERT INTO Branches (BranchName, BranchCity, BranchAddress, PhoneNumber, Email) VALUES
('Istanbul Merkez Subesi', 'Istanbul', 'Fatih, Istanbul', '+90 212 123 4567', 'istanbul@ihh.org.tr');

-- Temel yardim turleri
INSERT INTO AidTypes (AidTypeName, Description, Category) VALUES
('Gida Paketi', 'Temel erzaklardan olusan paket', 'Food'),
('Tibbi Destek', 'Hastalar icin tibbi malzeme', 'Medical'),
('Egitim Seti', 'Okul cantasi ve kiyafet destegi', 'Education'),
('Acil Nakit', 'Acil durumlar icin finansman', 'Emergency');

PRINT 'Tum tablolar basariyla olusturuldu!';
PRINT 'Artik uygulamayi kullanarak veri ekleyip silebilirsiniz.';
