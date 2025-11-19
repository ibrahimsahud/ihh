

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
    user: 'ahmet',
    password: '',
    server: 'AHMET\\SQLEXPRESS03',
    database: 'IHH_Hayir',
    options: {
        encrypt: false,
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

async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log('✓ تم الاتصال بقاعدة البيانات بنجاح');
        console.log('✓ السيرفر: AHMET\\SQLEXPRESS03');
        console.log('✓ قاعدة البيانات: IHH_Hayir');
    } catch (err) {
        console.error('✗ خطأ في الاتصال بقاعدة البيانات:', err.message);
        console.log('⚠ السيرفر سيعمل بدون قاعدة بيانات (وضع Demo فقط)');
    }
}



app.get('/api/dashboard/stats', async (req, res) => {
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
        console.error('خطأ في جلب الإحصائيات:', err);
        res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
    }
});



app.get('/api/donors', async (req, res) => {
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
        console.error('خطأ في جلب المتبرعين:', err);
        res.status(500).json({ error: 'خطأ في جلب المتبرعين' });
    }
});


app.post('/api/donors', async (req, res) => {
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

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم إضافة المتبرع بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة المتبرع:', err);
        res.status(500).json({ error: 'خطأ في إضافة المتبرع' });
    }
});


app.put('/api/donors/:id', async (req, res) => {
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

        res.json({ success: true, message: 'تم تحديث المتبرع بنجاح' });
    } catch (err) {
        console.error('خطأ في تحديث المتبرع:', err);
        res.status(500).json({ error: 'خطأ في تحديث المتبرع' });
    }
});


app.delete('/api/donors/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Donors
                SET IsActive = 0
                WHERE DonorID = @id
            `);

        res.json({ success: true, message: 'تم حذف المتبرع بنجاح' });
    } catch (err) {
        console.error('خطأ في حذف المتبرع:', err);
        res.status(500).json({ error: 'خطأ في حذف المتبرع' });
    }
});



app.get('/api/donations', async (req, res) => {
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
        console.error('خطأ في جلب التبرعات:', err);
        res.status(500).json({ error: 'خطأ في جلب التبرعات' });
    }
});


app.post('/api/donations', async (req, res) => {
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

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم تسجيل التبرع بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة التبرع:', err);
        res.status(500).json({ error: 'خطأ في إضافة التبرع' });
    }
});



app.get('/api/beneficiaries', async (req, res) => {
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
        console.error('خطأ في جلب المستفيدين:', err);
        res.status(500).json({ error: 'خطأ في جلب المستفيدين' });
    }
});


app.post('/api/beneficiaries', async (req, res) => {
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

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم إضافة المستفيد بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة المستفيد:', err);
        res.status(500).json({ error: 'خطأ في إضافة المستفيد' });
    }
});


app.put('/api/beneficiaries/:id', async (req, res) => {
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

        res.json({ success: true, message: 'تم تحديث المستفيد بنجاح' });
    } catch (err) {
        console.error('خطأ في تحديث المستفيد:', err);
        res.status(500).json({ error: 'خطأ في تحديث المستفيد' });
    }
});


app.delete('/api/beneficiaries/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Beneficiaries
                SET IsActive = 0
                WHERE BeneficiaryID = @id
            `);

        res.json({ success: true, message: 'تم حذف المستفيد بنجاح' });
    } catch (err) {
        console.error('خطأ في حذف المستفيد:', err);
        res.status(500).json({ error: 'خطأ في حذف المستفيد' });
    }
});



app.get('/api/aid-distributions', async (req, res) => {
    try {
        const result = await pool.request().query(`
            SELECT
                a.AidDistributionID as id,
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
        console.error('خطأ في جلب المساعدات:', err);
        res.status(500).json({ error: 'خطأ في جلب المساعدات' });
    }
});


app.post('/api/aid-distributions', async (req, res) => {
    try {
        const { beneficiaryId, aidType, quantity, estimatedValue, notes } = req.body;

        const aidTypeResult = await pool.request()
            .input('aidType', sql.NVarChar(50), aidType)
            .query(`
                SELECT AidTypeID FROM AidTypes WHERE AidTypeName = @aidType
            `);

        if (aidTypeResult.recordset.length === 0) {
            return res.status(400).json({ error: 'نوع المساعدة غير صحيح' });
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

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم تسجيل المساعدة بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة المساعدة:', err);
        res.status(500).json({ error: 'خطأ في إضافة المساعدة' });
    }
});



app.get('/api/staff', async (req, res) => {
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
                Salary as salary,
                FORMAT(HireDate, 'dd/MM/yyyy') as hireDate,
                IsActive as isActive
            FROM Staff
            WHERE IsActive = 1
            ORDER BY HireDate DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('خطأ في جلب الموظفين:', err);
        res.status(500).json({ error: 'خطأ في جلب الموظفين' });
    }
});


app.post('/api/staff', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, position, department, salary } = req.body;

        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), firstName)
            .input('lastName', sql.NVarChar(50), lastName)
            .input('phone', sql.NVarChar(20), phone || null)
            .input('email', sql.NVarChar(100), email || null)
            .input('position', sql.NVarChar(50), position)
            .input('department', sql.NVarChar(50), department)
            .input('salary', sql.Decimal(18, 2), salary)
            .query(`
                INSERT INTO Staff (
                    FirstName, LastName, PhoneNumber, Email,
                    Position, Department, Salary, IsActive
                )
                VALUES (
                    @firstName, @lastName, @phone, @email,
                    @position, @department, @salary, 1
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم إضافة الموظف بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة الموظف:', err);
        res.status(500).json({ error: 'خطأ في إضافة الموظف' });
    }
});


app.put('/api/staff/:id', async (req, res) => {
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
            .input('department', sql.NVarChar(50), department)
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
                    Salary = @salary
                WHERE StaffID = @id
            `);

        res.json({ success: true, message: 'تم تحديث الموظف بنجاح' });
    } catch (err) {
        console.error('خطأ في تحديث الموظف:', err);
        res.status(500).json({ error: 'خطأ في تحديث الموظف' });
    }
});


app.delete('/api/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE Staff
                SET IsActive = 0
                WHERE StaffID = @id
            `);

        res.json({ success: true, message: 'تم حذف الموظف بنجاح' });
    } catch (err) {
        console.error('خطأ في حذف الموظف:', err);
        res.status(500).json({ error: 'خطأ في حذف الموظف' });
    }
});



app.get('/api/sponsorships', async (req, res) => {
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
        console.error('خطأ في جلب الكفالات:', err);
        res.status(500).json({ error: 'خطأ في جلب الكفالات' });
    }
});


app.post('/api/sponsorships', async (req, res) => {
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

        res.json({
            success: true,
            id: result.recordset[0].id,
            message: 'تم تسجيل الكفالة بنجاح'
        });
    } catch (err) {
        console.error('خطأ في إضافة الكفالة:', err);
        res.status(500).json({ error: 'خطأ في إضافة الكفالة' });
    }
});



app.get('/api/reports', async (req, res) => {
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
                COUNT(ad.AidDistributionID) as count,
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
        console.error('خطأ في جلب التقارير:', err);
        res.status(500).json({ error: 'خطأ في جلب التقارير' });
    }
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 سيرفر IHH يعمل على المنفذ ${PORT}`);
        console.log(`🌐 افتح المتصفح على: http://localhost:${PORT}`);
        console.log(`========================================\n`);
    });
}).catch(err => {
    console.error('فشل بدء السيرفر:', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('\n\n⏳ إيقاف السيرفر...');
    if (pool) {
        await pool.close();
        console.log('✓ تم إغلاق اتصال قاعدة البيانات');
    }
    console.log('✓ تم إيقاف السيرفر بنجاح\n');
    process.exit(0);
});
