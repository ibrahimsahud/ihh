

const sql = require('mssql');

// Configuration for database connection
// Use environment variables in production, fallback to local values for development
const config = {
    user: process.env.DB_USER || 'ihhuser',
    password: process.env.DB_PASSWORD || 'IHH@2025',
    server: process.env.DB_SERVER || 'IBOO',
    database: process.env.DB_NAME || 'IHH_Hayir',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true' || true,
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true' || true,
        enableArithAbort: true
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log('✓ Veritabani baglantisi basarili');
        return pool;
    } catch (err) {
        console.error('✗ Veritabani baglantisi hatasi:', err.message);
        throw err;
    }
}



async function getAllDonors() {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    DonorID as id,
                    FirstName as firstName,
                    LastName as lastName,
                    PhoneNumber as phone,
                    Email as email,
                    City as city,
                    Country as country,
                    DonorType as type,
                    FORMAT(RegistrationDate, 'dd/MM/yyyy') as date,
                    IsActive as isActive
                FROM Donors
                WHERE IsActive = 1
                ORDER BY RegistrationDate DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error('Bagisci listeleme hatasi:', err);
        throw err;
    }
}


async function addDonor(donor) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), donor.firstName)
            .input('lastName', sql.NVarChar(50), donor.lastName)
            .input('phone', sql.NVarChar(20), donor.phone || null)
            .input('email', sql.NVarChar(100), donor.email || null)
            .input('address', sql.NVarChar(200), donor.address || null)
            .input('city', sql.NVarChar(50), donor.city || null)
            .input('country', sql.NVarChar(50), donor.country || 'Turkey')
            .input('type', sql.NVarChar(20), donor.type)
            .query(`
                INSERT INTO Donors (
                    FirstName, LastName, PhoneNumber, Email, 
                    Address, City, Country, DonorType, IsActive
                )
                VALUES (
                    @firstName, @lastName, @phone, @email,
                    @address, @city, @country, @type, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    } catch (err) {
        console.error('Bagisci ekleme hatasi:', err);
        throw err;
    }
}


async function updateDonor(id, donor) {
    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.NVarChar(50), donor.firstName)
            .input('lastName', sql.NVarChar(50), donor.lastName)
            .input('phone', sql.NVarChar(20), donor.phone)
            .input('email', sql.NVarChar(100), donor.email)
            .input('address', sql.NVarChar(200), donor.address)
            .input('city', sql.NVarChar(50), donor.city)
            .input('country', sql.NVarChar(50), donor.country)
            .input('type', sql.NVarChar(20), donor.type)
            .query(`
                UPDATE Donors
                SET 
                    FirstName = @firstName,
                    LastName = @lastName,
                    PhoneNumber = @phone,
                    Email = @email,
                    Address = @address,
                    City = @city,
                    Country = @country,
                    DonorType = @type
                WHERE DonorID = @id
            `);
        return true;
    } catch (err) {
        console.error('Bagisci guncelleme hatasi:', err);
        throw err;
    }
}


async function deleteDonor(id) {
    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Donors
                SET IsActive = 0
                WHERE DonorID = @id
            `);
        return true;
    } catch (err) {
        console.error('Bagisci silme hatasi:', err);
        throw err;
    }
}



async function getAllDonations() {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    d.DonationID as id,
                    d.DonorID as donorId,
                    donor.FirstName + ' ' + donor.LastName as donorName,
                    d.DonationAmount as amount,
                    d.DonationCurrency as currency,
                    d.DonationType as type,
                    d.PaymentMethod as paymentMethod,
                    d.ReceiptNumber as receiptNumber,
                    d.Notes as notes,
                    FORMAT(d.DonationDate, 'dd/MM/yyyy') as date,
                    b.BranchName as branchName
                FROM Donations d
                INNER JOIN Donors donor ON d.DonorID = donor.DonorID
                INNER JOIN Branches b ON d.BranchID = b.BranchID
                ORDER BY d.DonationDate DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error('Bagis listeleme hatasi:', err);
        throw err;
    }
}


async function addDonation(donation) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('donorId', sql.Int, donation.donorId)
            .input('branchId', sql.Int, donation.branchId || 1)
            .input('amount', sql.Decimal(18, 2), donation.amount)
            .input('currency', sql.NVarChar(10), donation.currency || 'TRY')
            .input('type', sql.NVarChar(20), donation.type)
            .input('paymentMethod', sql.NVarChar(20), donation.paymentMethod)
            .input('receiptNumber', sql.NVarChar(50), donation.receiptNumber || null)
            .input('notes', sql.NVarChar(500), donation.notes || null)
            .query(`
                INSERT INTO Donations (
                    DonorID, BranchID, DonationAmount, DonationCurrency,
                    DonationType, PaymentMethod, ReceiptNumber, Notes
                )
                VALUES (
                    @donorId, @branchId, @amount, @currency,
                    @type, @paymentMethod, @receiptNumber, @notes
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    } catch (err) {
        console.error('Bagis ekleme hatasi:', err);
        throw err;
    }
}



async function getAllBeneficiaries() {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    BeneficiaryID as id,
                    FirstName as firstName,
                    LastName as lastName,
                    DateOfBirth as dateOfBirth,
                    Gender as gender,
                    BeneficiaryType as type,
                    PhoneNumber as phone,
                    Address as address,
                    City as city,
                    Country as country,
                    FamilySize as familySize,
                    MonthlyIncome as monthlyIncome,
                    FORMAT(RegistrationDate, 'dd/MM/yyyy') as date,
                    IsActive as isActive
                FROM Beneficiaries
                WHERE IsActive = 1
                ORDER BY RegistrationDate DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error('Faydalanici listeleme hatasi:', err);
        throw err;
    }
}


async function addBeneficiary(beneficiary) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), beneficiary.firstName)
            .input('lastName', sql.NVarChar(50), beneficiary.lastName)
            .input('dateOfBirth', sql.Date, beneficiary.dateOfBirth || null)
            .input('gender', sql.NVarChar(10), beneficiary.gender || null)
            .input('phone', sql.NVarChar(20), beneficiary.phone || null)
            .input('address', sql.NVarChar(200), beneficiary.address || null)
            .input('city', sql.NVarChar(50), beneficiary.city || null)
            .input('country', sql.NVarChar(50), beneficiary.country || 'Turkey')
            .input('familySize', sql.Int, beneficiary.familySize || null)
            .input('monthlyIncome', sql.Decimal(18, 2), beneficiary.monthlyIncome || null)
            .input('type', sql.NVarChar(20), beneficiary.type)
            .query(`
                INSERT INTO Beneficiaries (
                    FirstName, LastName, DateOfBirth, Gender,
                    PhoneNumber, Address, City, Country,
                    FamilySize, MonthlyIncome, BeneficiaryType, IsActive
                )
                VALUES (
                    @firstName, @lastName, @dateOfBirth, @gender,
                    @phone, @address, @city, @country,
                    @familySize, @monthlyIncome, @type, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    } catch (err) {
        console.error('Faydalanici ekleme hatasi:', err);
        throw err;
    }
}



async function getAllStaff() {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    s.StaffID as id,
                    s.FirstName as firstName,
                    s.LastName as lastName,
                    s.PhoneNumber as phone,
                    s.Email as email,
                    s.Position as position,
                    s.Department as department,
                    s.MonthlySalary as salary,
                    FORMAT(s.HireDate, 'dd/MM/yyyy') as hireDate,
                    b.BranchName as branchName,
                    s.IsActive as isActive
                FROM Staff s
                LEFT JOIN Branches b ON s.BranchID = b.BranchID
                WHERE s.IsActive = 1
                ORDER BY s.HireDate DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error('Personel listeleme hatasi:', err);
        throw err;
    }
}


async function addStaff(staff) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), staff.firstName)
            .input('lastName', sql.NVarChar(50), staff.lastName)
            .input('phone', sql.NVarChar(20), staff.phone || null)
            .input('email', sql.NVarChar(100), staff.email || null)
            .input('position', sql.NVarChar(50), staff.position)
            .input('department', sql.NVarChar(50), staff.department || null)
            .input('branchId', sql.Int, staff.branchId || 1)
            .input('hireDate', sql.Date, staff.hireDate || new Date())
            .input('salary', sql.Decimal(18, 2), staff.salary || null)
            .query(`
                INSERT INTO Staff (
                    FirstName, LastName, PhoneNumber, Email,
                    Position, Department, BranchID,
                    HireDate, MonthlySalary, IsActive
                )
                VALUES (
                    @firstName, @lastName, @phone, @email,
                    @position, @department, @branchId,
                    @hireDate, @salary, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    } catch (err) {
        console.error('Personel ekleme hatasi:', err);
        throw err;
    }
}



async function getDashboardStats() {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM Donors WHERE IsActive = 1) as totalDonors,
                    (SELECT COUNT(*) FROM Donations) as totalDonations,
                    (SELECT COUNT(*) FROM Beneficiaries WHERE IsActive = 1) as totalBeneficiaries,
                    (SELECT COUNT(*) FROM Staff WHERE IsActive = 1) as totalStaff,
                    (SELECT ISNULL(SUM(DonationAmount), 0) FROM Donations) as totalDonationAmount,
                    (SELECT COUNT(*) FROM AidDistribution) as totalAidDistributions,
                    (SELECT COUNT(*) FROM OrphanSponsorship WHERE IsActive = 1) as activeSponsorships
            `);
        return result.recordset[0];
    } catch (err) {
        console.error('Istatistik sorgu hatasi:', err);
        throw err;
    }
}


async function getTopDonors(limit = 10) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('limit', sql.Int, limit)
            .query(`
                SELECT TOP (@limit)
                    d.DonorID as id,
                    d.FirstName + ' ' + d.LastName as donorName,
                    d.DonorType as donorType,
                    COUNT(dn.DonationID) as donationCount,
                    SUM(dn.DonationAmount) as totalAmount,
                    d.PhoneNumber as phone,
                    d.Email as email
                FROM Donors d
                INNER JOIN Donations dn ON d.DonorID = dn.DonorID
                WHERE d.IsActive = 1
                GROUP BY d.DonorID, d.FirstName, d.LastName, d.DonorType, d.PhoneNumber, d.Email
                ORDER BY totalAmount DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error('En cok bagisci sorgu hatasi:', err);
        throw err;
    }
}


async function testConnection() {
    try {
        const pool = await connectToDatabase();
        console.log('✓ Veritabani baglantisi sorunsuz calisiyor');
        await pool.close();
        return true;
    } catch (err) {
        console.error('✗ Veritabani baglantisi basarisiz:', err.message);
        return false;
    }
}


module.exports = {
    connectToDatabase,
    testConnection,
    
    getAllDonors,
    addDonor,
    updateDonor,
    deleteDonor,
    
    getAllDonations,
    addDonation,
    
    getAllBeneficiaries,
    addBeneficiary,
    
    getAllStaff,
    addStaff,
    
    getDashboardStats,
    getTopDonors
};

