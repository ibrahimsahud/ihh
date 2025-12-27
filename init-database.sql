-- IHH Database Schema for PostgreSQL (Render.com)
-- Run this script to create all tables

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS orphansponsorship CASCADE;
DROP TABLE IF EXISTS aiddistribution CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS beneficiaries CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS aidtypes CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS systemnotifications CASCADE;

-- Branches table
CREATE TABLE branches (
    branchid SERIAL PRIMARY KEY,
    branchname VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Turkey',
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    isactive BOOLEAN DEFAULT TRUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors table
CREATE TABLE donors (
    donorid SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(200),
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Turkey',
    donortype VARCHAR(20) NOT NULL,
    registrationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isactive BOOLEAN DEFAULT TRUE
);

-- Beneficiaries table
CREATE TABLE beneficiaries (
    beneficiaryid SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phonenumber VARCHAR(20),
    address VARCHAR(200),
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Turkey',
    beneficiarytype VARCHAR(20) NOT NULL,
    familysize INTEGER DEFAULT 1,
    monthlyincome DECIMAL(18, 2) DEFAULT 0,
    registrationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isactive BOOLEAN DEFAULT TRUE
);

-- Staff table
CREATE TABLE staff (
    staffid SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    position VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    monthlysalary DECIMAL(18, 2),
    hiredate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isactive BOOLEAN DEFAULT TRUE
);

-- Aid Types table
CREATE TABLE aidtypes (
    aidtypeid SERIAL PRIMARY KEY,
    aidtypename VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    isactive BOOLEAN DEFAULT TRUE
);

-- Donations table
CREATE TABLE donations (
    donationid SERIAL PRIMARY KEY,
    donorid INTEGER NOT NULL REFERENCES donors(donorid),
    branchid INTEGER REFERENCES branches(branchid),
    donationamount DECIMAL(18, 2) NOT NULL,
    donationcurrency VARCHAR(10) DEFAULT 'TRY',
    donationtype VARCHAR(20) NOT NULL,
    paymentmethod VARCHAR(20) NOT NULL,
    notes VARCHAR(500),
    donationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aid Distribution table
CREATE TABLE aiddistribution (
    distributionid SERIAL PRIMARY KEY,
    beneficiaryid INTEGER NOT NULL REFERENCES beneficiaries(beneficiaryid),
    branchid INTEGER REFERENCES branches(branchid),
    aidtypeid INTEGER NOT NULL REFERENCES aidtypes(aidtypeid),
    quantity INTEGER DEFAULT 1,
    estimatedvalue DECIMAL(18, 2),
    notes VARCHAR(500),
    distributiondate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orphan Sponsorship table
CREATE TABLE orphansponsorship (
    sponsorshipid SERIAL PRIMARY KEY,
    donorid INTEGER NOT NULL REFERENCES donors(donorid),
    beneficiaryid INTEGER NOT NULL REFERENCES beneficiaries(beneficiaryid),
    monthlyamount DECIMAL(18, 2) NOT NULL,
    paymentfrequency VARCHAR(20) NOT NULL,
    startdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enddate TIMESTAMP,
    isactive BOOLEAN DEFAULT TRUE
);

-- System Notifications table
CREATE TABLE systemnotifications (
    notificationid SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isread BOOLEAN DEFAULT FALSE
);

-- Insert default branch
INSERT INTO branches (branchname, city, country) VALUES ('Merkez Şube', 'Istanbul', 'Turkey');

-- Insert aid types
INSERT INTO aidtypes (aidtypename, description) VALUES 
    ('Gıda', 'Gıda yardımları'),
    ('Giyim', 'Giysi ve kıyafet yardımları'),
    ('Eğitim', 'Eğitim malzemeleri ve burs'),
    ('Sağlık', 'Sağlık hizmetleri ve ilaç'),
    ('Barınma', 'Barınma ve kira yardımı'),
    ('Nakit', 'Nakit para yardımı'),
    ('Diğer', 'Diğer yardım türleri');

-- Insert sample data for testing
INSERT INTO donors (firstname, lastname, phonenumber, email, city, country, donortype) VALUES 
    ('Ahmet', 'Yılmaz', '05551234567', 'ahmet@email.com', 'Istanbul', 'Turkey', 'Bireysel'),
    ('Fatma', 'Kaya', '05559876543', 'fatma@email.com', 'Ankara', 'Turkey', 'Bireysel'),
    ('ABC', 'Şirketi', '02121234567', 'info@abc.com', 'Istanbul', 'Turkey', 'Kurumsal');

INSERT INTO beneficiaries (firstname, lastname, phonenumber, city, country, beneficiarytype, familysize) VALUES 
    ('Mehmet', 'Demir', '05551112233', 'Gaziantep', 'Turkey', 'Aile', 5),
    ('Ayşe', 'Çelik', '05554445566', 'Hatay', 'Turkey', 'Yetim', 1),
    ('Ali', 'Öztürk', '05557778899', 'Şanlıurfa', 'Turkey', 'Aile', 4);

INSERT INTO staff (firstname, lastname, phonenumber, email, position, department, monthlysalary) VALUES 
    ('Mustafa', 'Şahin', '05551111111', 'mustafa@ihh.org', 'Müdür', 'Yönetim', 15000),
    ('Zeynep', 'Arslan', '05552222222', 'zeynep@ihh.org', 'Koordinatör', 'Yardım', 10000);

-- Create indexes for better performance
CREATE INDEX idx_donors_isactive ON donors(isactive);
CREATE INDEX idx_beneficiaries_isactive ON beneficiaries(isactive);
CREATE INDEX idx_staff_isactive ON staff(isactive);
CREATE INDEX idx_donations_donorid ON donations(donorid);
CREATE INDEX idx_donations_date ON donations(donationdate);
CREATE INDEX idx_aiddistribution_beneficiaryid ON aiddistribution(beneficiaryid);
CREATE INDEX idx_notifications_createdat ON systemnotifications(createdat);

-- Success message
SELECT 'Database initialized successfully!' as status;
