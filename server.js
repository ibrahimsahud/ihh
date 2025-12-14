

const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const config = {
    user: 'ihhuser',
    password: 'IHH@2025',
    server: 'IBOO',
    database: 'IHH_Hayir',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;
const NOTIFICATIONS_TABLE = 'SystemNotifications';

function ensurePool(res) {
    if (!pool) {
        res.status(503).json({ error: 'Veritabanı bağlantısı yok. Lütfen daha sonra tekrar deneyin.' });
        return false;
    }
    return true;
}

async function ensureNotificationTable() {
    if (!pool) return;
    const createTableQuery = `
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[${NOTIFICATIONS_TABLE}]') AND type = 'U')
        BEGIN
            CREATE TABLE [dbo].[${NOTIFICATIONS_TABLE}] (
                NotificationID INT IDENTITY(1,1) PRIMARY KEY,
                Title NVARCHAR(150) NOT NULL,
                Message NVARCHAR(500) NOT NULL,
                Type NVARCHAR(20) NOT NULL DEFAULT 'info',
                CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                IsRead BIT NOT NULL DEFAULT 0
            )
        END`;

    try {
        await pool.request().query(createTableQuery);
    } catch (err) {
        console.error('Bildirim tablosu oluşturulamadı:', err.message);
    }
}

async function createNotification({ type = 'info', title, message }) {
    if (!pool || !title || !message) {
        return;
    }

    try {
        await pool.request()
            .input('title', sql.NVarChar(150), title)
            .input('message', sql.NVarChar(500), message)
            .input('type', sql.NVarChar(20), type)
            .query(`
                INSERT INTO ${NOTIFICATIONS_TABLE} (Title, Message, Type)
                VALUES (@title, @message, @type)
            `);
    } catch (err) {
        console.error('Bildirim kaydedilemedi:', err.message);
    }
}

async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log('✓ Veritabanına başarıyla bağlanıldı');
        console.log('✓ Sunucu: IBOO');
        console.log('✓ Veritabanı: IHH_Hayir');
        await ensureNotificationTable();
    } catch (err) {
        console.error('✗ Veritabanına bağlanırken hata:', err.message);
        console.log('⚠ Sunucu veritabanı olmadan (yalnızca demo modu) çalışacak');
    }
}



app.get('/api/dashboard/stats', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                (SELECT COUNT(*) FROM Donors WHERE IsActive = 1) as totalDonors,
                (SELECT COUNT(*) FROM Donations) as totalDonations,
                (SELECT COUNT(*) FROM Beneficiaries WHERE IsActive = 1) as totalBeneficiaries,
                (SELECT COUNT(*) FROM Staff WHERE IsActive = 1) as totalStaff,
                (SELECT ISNULL(SUM(DonationAmount), 0) FROM Donations) as totalDonationAmount,
                (SELECT COUNT(*) FROM AidDistribution) as totalAidDistributions
        `);

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('İstatistikler alınırken hata oluştu:', err);
        res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
    }
});



app.get('/api/donors', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                DonorID as id,
                FirstName as firstName,
                LastName as lastName,
                PhoneNumber as phone,
                Email as email,
                Address as address,
                City as city,
                Country as country,
                DonorType as type,
                FORMAT(RegistrationDate, 'dd/MM/yyyy') as date,
                IsActive as isActive
            FROM Donors
            WHERE IsActive = 1
            ORDER BY RegistrationDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Bağışçılar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bağışçılar alınırken hata oluştu' });
    }
});


app.post('/api/donors', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, email, address, city, country, type } = req.body;

        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone || null)
            .input('email', sql.NVarChar(100), email || null)
            .input('address', sql.NVarChar(200), address || null)
            .input('city', sql.NVarChar(50), city || null)
            .input('country', sql.NVarChar(50), country || 'Turkey')
            .input('type', sql.NVarChar(20), type)
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

        await createNotification({
            type: 'success',
            title: 'Yeni Bağışçı',
            message: `${firstName} ${lastName} bağışçı olarak eklendi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Bağışçı başarıyla eklendi'
        });
    } catch (err) {
        console.error('Bağışçı eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bağışçı eklenirken hata oluştu' });
    }
});


app.put('/api/donors/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, email, address, city, country, type } = req.body;

        await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone)
            .input('email', sql.NVarChar(100), email)
            .input('address', sql.NVarChar(200), address)
            .input('city', sql.NVarChar(50), city)
            .input('country', sql.NVarChar(50), country)
            .input('type', sql.NVarChar(20), type)
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

        await createNotification({
            type: 'info',
            title: 'Bağışçı Güncellemesi',
            message: `ID ${id} numaralı bağışçı güncellendi`
        });

        res.json({ success: true, message: 'Bağışçı başarıyla güncellendi' });
    } catch (err) {
        console.error('Bağışçı güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bağışçı güncellenirken hata oluştu' });
    }
});


app.delete('/api/donors/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Donors
                SET IsActive = 0
                WHERE DonorID = @id
            `);

        await createNotification({
            type: 'warning',
            title: 'Bağışçı Pasifleştirildi',
            message: `ID ${id} numaralı bağışçı pasifleştirildi`
        });

        res.json({ success: true, message: 'Bağışçı başarıyla silindi' });
    } catch (err) {
        console.error('Bağışçı silinirken hata oluştu:', err);
        res.status(500).json({ error: 'Bağışçı silinirken hata oluştu' });
    }
});



app.get('/api/donations', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                d.DonationID as id,
                d.DonorID as donorId,
                donor.FirstName + ' ' + donor.LastName as donorName,
                d.DonationAmount as amount,
                d.DonationCurrency as currency,
                d.DonationType as type,
                d.PaymentMethod as paymentMethod,
                d.Notes as notes,
                FORMAT(d.DonationDate, 'dd/MM/yyyy') as date
            FROM Donations d
            INNER JOIN Donors donor ON d.DonorID = donor.DonorID
            ORDER BY d.DonationDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Bağış kayıtları alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bağış kayıtları alınırken hata oluştu' });
    }
});


app.post('/api/donations', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { donorId, branchId, amount, currency, type, paymentMethod, notes } = req.body;

        const result = await pool.request()
            .input('donorId', sql.Int, donorId)
            .input('branchId', sql.Int, branchId || 1)
            .input('amount', sql.Decimal(18, 2), amount)
            .input('currency', sql.NVarChar(10), currency || 'TRY')
            .input('type', sql.NVarChar(20), type)
            .input('paymentMethod', sql.NVarChar(20), paymentMethod)
            .input('notes', sql.NVarChar(500), notes || null)
            .query(`
                INSERT INTO Donations (
                    DonorID, BranchID, DonationAmount, DonationCurrency,
                    DonationType, PaymentMethod, Notes
                )
                VALUES (
                    @donorId, @branchId, @amount, @currency,
                    @type, @paymentMethod, @notes
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        await createNotification({
            type: 'success',
            title: 'Yeni Bağış',
            message: `${donorId} numaralı bağışçı için ${amount} ${currency || 'TRY'} tutarında bağış kaydedildi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Bağış başarıyla kaydedildi'
        });
    } catch (err) {
        console.error('Bağış eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bağış eklenirken hata oluştu' });
    }
});



app.get('/api/beneficiaries', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                BeneficiaryID as id,
                FirstName as firstName,
                LastName as lastName,
                PhoneNumber as phone,
                Address as address,
                City as city,
                Country as country,
                BeneficiaryType as type,
                FamilySize as familySize,
                MonthlyIncome as monthlyIncome,
                FORMAT(RegistrationDate, 'dd/MM/yyyy') as date,
                IsActive as isActive
            FROM Beneficiaries
            WHERE IsActive = 1
            ORDER BY RegistrationDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Yararlanıcılar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Yararlanıcılar alınırken hata oluştu' });
    }
});


app.post('/api/beneficiaries', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, address, city, country, type, familySize, monthlyIncome } = req.body;

        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone || null)
            .input('address', sql.NVarChar(200), address || null)
            .input('city', sql.NVarChar(50), city || null)
            .input('country', sql.NVarChar(50), country || 'Turkey')
            .input('type', sql.NVarChar(20), type)
            .input('familySize', sql.Int, familySize || 1)
            .input('monthlyIncome', sql.Decimal(18, 2), monthlyIncome || 0)
            .query(`
                INSERT INTO Beneficiaries (
                    FirstName, LastName, PhoneNumber, Address,
                    City, Country, BeneficiaryType, FamilySize, MonthlyIncome, IsActive
                )
                VALUES (
                    @firstName, @lastName, @phone, @address,
                    @city, @country, @type, @familySize, @monthlyIncome, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        await createNotification({
            type: 'success',
            title: 'Yeni Yararlanıcı',
            message: `${firstName} ${lastName} yararlanıcı olarak eklendi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Yararlanıcı başarıyla eklendi'
        });
    } catch (err) {
        console.error('Yararlanıcı eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Yararlanıcı eklenirken hata oluştu' });
    }
});


app.put('/api/beneficiaries/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, address, city, country, type, familySize, monthlyIncome } = req.body;

        await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone)
            .input('address', sql.NVarChar(200), address)
            .input('city', sql.NVarChar(50), city)
            .input('country', sql.NVarChar(50), country)
            .input('type', sql.NVarChar(20), type)
            .input('familySize', sql.Int, familySize)
            .input('monthlyIncome', sql.Decimal(18, 2), monthlyIncome)
            .query(`
                UPDATE Beneficiaries
                SET
                    FirstName = @firstName,
                    LastName = @lastName,
                    PhoneNumber = @phone,
                    Address = @address,
                    City = @city,
                    Country = @country,
                    BeneficiaryType = @type,
                    FamilySize = @familySize,
                    MonthlyIncome = @monthlyIncome
                WHERE BeneficiaryID = @id
            `);

        await createNotification({
            type: 'info',
            title: 'Yararlanıcı Güncellemesi',
            message: `ID ${id} numaralı yararlanıcı güncellendi`
        });

        res.json({ success: true, message: 'Yararlanıcı başarıyla güncellendi' });
    } catch (err) {
        console.error('Yararlanıcı güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Yararlanıcı güncellenirken hata oluştu' });
    }
});


app.delete('/api/beneficiaries/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Beneficiaries
                SET IsActive = 0
                WHERE BeneficiaryID = @id
            `);

        await createNotification({
            type: 'warning',
            title: 'Yararlanıcı Pasifleştirildi',
            message: `ID ${id} numaralı yararlanıcı pasifleştirildi`
        });

        res.json({ success: true, message: 'Yararlanıcı başarıyla silindi' });
    } catch (err) {
        console.error('Yararlanıcı silinirken hata oluştu:', err);
        res.status(500).json({ error: 'Yararlanıcı silinirken hata oluştu' });
    }
});



app.get('/api/aid-distributions', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                a.DistributionID as id,
                a.BeneficiaryID as beneficiaryId,
                b.FirstName + ' ' + b.LastName as beneficiaryName,
                at.AidTypeName as aidType,
                a.Quantity as quantity,
                a.EstimatedValue as estimatedValue,
                a.Notes as notes,
                FORMAT(a.DistributionDate, 'dd/MM/yyyy') as date
            FROM AidDistribution a
            INNER JOIN Beneficiaries b ON a.BeneficiaryID = b.BeneficiaryID
            INNER JOIN AidTypes at ON a.AidTypeID = at.AidTypeID
            ORDER BY a.DistributionDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Yardım dağıtımları alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Yardım dağıtımları alınırken hata oluştu' });
    }
});


app.post('/api/aid-distributions', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { beneficiaryId, aidType, quantity, estimatedValue, notes } = req.body;

        const aidTypeResult = await pool.request()
            .input('aidType', sql.NVarChar(50), aidType)
            .query(`
                SELECT AidTypeID FROM AidTypes WHERE AidTypeName = @aidType
            `);

        if (aidTypeResult.recordset.length === 0) {
            return res.status(400).json({ error: 'Geçersiz yardım türü seçildi' });
        }

        const aidTypeId = aidTypeResult.recordset[0].AidTypeID;

        const result = await pool.request()
            .input('beneficiaryId', sql.Int, beneficiaryId)
            .input('branchId', sql.Int, 1)
            .input('aidTypeId', sql.Int, aidTypeId)
            .input('quantity', sql.Int, quantity)
            .input('estimatedValue', sql.Decimal(18, 2), estimatedValue || null)
            .input('notes', sql.NVarChar(500), notes || null)
            .query(`
                INSERT INTO AidDistribution (
                    BeneficiaryID, BranchID, AidTypeID, Quantity, EstimatedValue, Notes
                )
                VALUES (
                    @beneficiaryId, @branchId, @aidTypeId, @quantity, @estimatedValue, @notes
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        await createNotification({
            type: 'info',
            title: 'Yardım Dağıtımı',
            message: `${beneficiaryId} numaralı yararlanıcı için ${aidType} türünde yardım kaydedildi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Yardım kaydı başarıyla tamamlandı'
        });
    } catch (err) {
        console.error('Yardım kaydedilirken hata oluştu:', err);
        res.status(500).json({ error: 'Yardım kaydedilirken hata oluştu' });
    }
});



app.get('/api/staff', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                StaffID as id,
                FirstName as firstName,
                LastName as lastName,
                PhoneNumber as phone,
                Email as email,
                Position as position,
                Department as department,
                MonthlySalary as salary,
                FORMAT(HireDate, 'dd/MM/yyyy') as hireDate,
                IsActive as isActive
            FROM Staff
            WHERE IsActive = 1
            ORDER BY HireDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Personel listesi alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Personel listesi alınırken hata oluştu' });
    }
});


app.post('/api/staff', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, email, position, department, salary } = req.body;

        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone || null)
            .input('email', sql.NVarChar(100), email || null)
            .input('position', sql.NVarChar(50), position)
            .input('department', sql.NVarChar(50), department || null)
            .input('salary', sql.Decimal(18, 2), salary)
            .query(`
                INSERT INTO Staff (
                    FirstName, LastName, PhoneNumber, Email,
                    Position, Department, MonthlySalary, IsActive
                )
                VALUES (
                    @firstName, @lastName, @phone, @email,
                    @position, @department, @salary, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        await createNotification({
            type: 'success',
            title: 'Yeni Personel',
            message: `${firstName} ${lastName} personel olarak eklendi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Personel başarıyla eklendi'
        });
    } catch (err) {
        console.error('Personel eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Personel eklenirken hata oluştu' });
    }
});


app.put('/api/staff/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, email, position, department, salary } = req.body;

        await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone)
            .input('email', sql.NVarChar(100), email)
            .input('position', sql.NVarChar(50), position)
            .input('department', sql.NVarChar(50), department || null)
            .input('salary', sql.Decimal(18, 2), salary)
            .query(`
                UPDATE Staff
                SET
                    FirstName = @firstName,
                    LastName = @lastName,
                    PhoneNumber = @phone,
                    Email = @email,
                    Position = @position,
                    Department = @department,
                    MonthlySalary = @salary
                WHERE StaffID = @id
            `);

        await createNotification({
            type: 'info',
            title: 'Personel Güncellemesi',
            message: `ID ${id} numaralı personel güncellendi`
        });

        res.json({ success: true, message: 'Personel başarıyla güncellendi' });
    } catch (err) {
        console.error('Personel güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Personel güncellenirken hata oluştu' });
    }
});


app.delete('/api/staff/:id', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Staff
                SET IsActive = 0
                WHERE StaffID = @id
            `);

        await createNotification({
            type: 'warning',
            title: 'Personel Pasifleştirildi',
            message: `ID ${id} numaralı personel pasifleştirildi`
        });

        res.json({ success: true, message: 'Personel başarıyla silindi' });
    } catch (err) {
        console.error('Personel silinirken hata oluştu:', err);
        res.status(500).json({ error: 'Personel silinirken hata oluştu' });
    }
});



app.get('/api/sponsorships', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT
                s.SponsorshipID as id,
                s.DonorID as donorId,
                d.FirstName + ' ' + d.LastName as donorName,
                s.BeneficiaryID as orphanId,
                b.FirstName + ' ' + b.LastName as orphanName,
                s.MonthlyAmount as monthlyAmount,
                s.PaymentFrequency as paymentFrequency,
                s.IsActive as isActive,
                FORMAT(s.StartDate, 'dd/MM/yyyy') as startDate
            FROM OrphanSponsorship s
            INNER JOIN Donors d ON s.DonorID = d.DonorID
            INNER JOIN Beneficiaries b ON s.BeneficiaryID = b.BeneficiaryID
            ORDER BY s.StartDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Sponsorluklar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Sponsorluklar alınırken hata oluştu' });
    }
});


app.post('/api/sponsorships', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { donorId, beneficiaryId, monthlyAmount, paymentFrequency } = req.body;

        const result = await pool.request()
            .input('donorId', sql.Int, donorId)
            .input('beneficiaryId', sql.Int, beneficiaryId)
            .input('monthlyAmount', sql.Decimal(18, 2), monthlyAmount)
            .input('paymentFrequency', sql.NVarChar(20), paymentFrequency)
            .query(`
                INSERT INTO OrphanSponsorship (
                    DonorID, BeneficiaryID, MonthlyAmount, PaymentFrequency, IsActive
                )
                VALUES (
                    @donorId, @beneficiaryId, @monthlyAmount, @paymentFrequency, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        await createNotification({
            type: 'success',
            title: 'Yeni Sponsorluk',
            message: `${donorId} numaralı bağışçı için sponsorluk kaydedildi`
        });

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'Sponsorluk başarıyla kaydedildi'
        });
    } catch (err) {
        console.error('Sponsorluk eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sponsorluk eklenirken hata oluştu' });
    }
});



app.get('/api/reports', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const statsResult = await pool.request().query(`
            SELECT
                (SELECT COUNT(*) FROM Donors WHERE IsActive = 1) as totalDonors,
                (SELECT COUNT(*) FROM Beneficiaries WHERE IsActive = 1) as totalBeneficiaries,
                (SELECT ISNULL(SUM(DonationAmount), 0) FROM Donations) as totalDonationAmount,
                (SELECT COUNT(*) FROM AidDistribution) as totalAidDistributions
        `);

        const topDonorsResult = await pool.request().query(`
            SELECT TOP 10
                d.FirstName + ' ' + d.LastName as donorName,
                COUNT(dn.DonationID) as donationCount,
                SUM(dn.DonationAmount) as totalAmount
            FROM Donors d
            INNER JOIN Donations dn ON d.DonorID = dn.DonorID
            WHERE d.IsActive = 1
            GROUP BY d.DonorID, d.FirstName, d.LastName
            ORDER BY totalAmount DESC
        `);

        const aidByTypeResult = await pool.request().query(`
            SELECT
                at.AidTypeName as aidType,
                COUNT(ad.DistributionID) as count,
                ISNULL(SUM(ad.EstimatedValue), 0) as totalValue
            FROM AidTypes at
            LEFT JOIN AidDistribution ad ON at.AidTypeID = ad.AidTypeID
            GROUP BY at.AidTypeName
            ORDER BY count DESC
        `);

        res.json({
            ...statsResult.recordset[0],
            topDonors: topDonorsResult.recordset,
            aidByType: aidByTypeResult.recordset
        });
    } catch (err) {
        console.error('Raporlar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Raporlar alınırken hata oluştu' });
    }
});


app.get('/api/notifications', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.request().query(`
            SELECT TOP (20)
                NotificationID as id,
                Title as title,
                Message as message,
                Type as type,
                IsRead as isRead,
                CreatedAt as createdAt
            FROM ${NOTIFICATIONS_TABLE}
            ORDER BY CreatedAt DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Bildirimler alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirimler alınırken hata oluştu' });
    }
});


app.post('/api/notifications/:id/read', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;
        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE ${NOTIFICATIONS_TABLE}
                SET IsRead = 1
                WHERE NotificationID = @id
            `);

        res.json({ success: true });
    } catch (err) {
        console.error('Bildirim durumu güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirim durumu güncellenirken hata oluştu' });
    }
});


app.post('/api/notifications/read-all', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        await pool.request().query(`
            UPDATE ${NOTIFICATIONS_TABLE}
            SET IsRead = 1
            WHERE IsRead = 0
        `);

        res.json({ success: true });
    } catch (err) {
        console.error('Bildirimler güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirimler güncellenirken hata oluştu' });
    }
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 IHH sunucusu ${PORT} portunda çalışıyor`);
        console.log(`🌐 Tarayıcıda aç: http://localhost:${PORT}`);
        console.log(`========================================\n`);
    });
}).catch(err => {
    console.error('Sunucu başlatılırken hata oluştu:', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('\n\n⏳ Sunucu kapatılıyor...');
    if (pool) {
        await pool.close();
        console.log('✓ Veritabanı bağlantısı kapatıldı');
    }
    console.log('✓ Sunucu başarıyla durduruldu\n');
    process.exit(0);
});
