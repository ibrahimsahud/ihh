const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// PostgreSQL connection using DATABASE_URL from Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const NOTIFICATIONS_TABLE = 'systemnotifications';

function ensurePool(res) {
    if (!pool) {
        res.status(503).json({ error: 'Veritabanı bağlantısı yok. Lütfen daha sonra tekrar deneyin.' });
        return false;
    }
    return true;
}

// Create all database tables automatically
async function initializeDatabase() {
    const createTablesQuery = `
        -- Branches table
        CREATE TABLE IF NOT EXISTS branches (
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
        CREATE TABLE IF NOT EXISTS donors (
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
        CREATE TABLE IF NOT EXISTS beneficiaries (
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
        CREATE TABLE IF NOT EXISTS staff (
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
        CREATE TABLE IF NOT EXISTS aidtypes (
            aidtypeid SERIAL PRIMARY KEY,
            aidtypename VARCHAR(50) NOT NULL UNIQUE,
            description VARCHAR(200),
            isactive BOOLEAN DEFAULT TRUE
        );

        -- Donations table
        CREATE TABLE IF NOT EXISTS donations (
            donationid SERIAL PRIMARY KEY,
            donorid INTEGER REFERENCES donors(donorid),
            branchid INTEGER REFERENCES branches(branchid),
            donationamount DECIMAL(18, 2) NOT NULL,
            donationcurrency VARCHAR(10) DEFAULT 'TRY',
            donationtype VARCHAR(20) NOT NULL,
            paymentmethod VARCHAR(20) NOT NULL,
            notes VARCHAR(500),
            donationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Aid Distribution table
        CREATE TABLE IF NOT EXISTS aiddistribution (
            distributionid SERIAL PRIMARY KEY,
            beneficiaryid INTEGER REFERENCES beneficiaries(beneficiaryid),
            branchid INTEGER REFERENCES branches(branchid),
            aidtypeid INTEGER REFERENCES aidtypes(aidtypeid),
            quantity INTEGER DEFAULT 1,
            estimatedvalue DECIMAL(18, 2),
            notes VARCHAR(500),
            distributiondate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Orphan Sponsorship table
        CREATE TABLE IF NOT EXISTS orphansponsorship (
            sponsorshipid SERIAL PRIMARY KEY,
            donorid INTEGER REFERENCES donors(donorid),
            beneficiaryid INTEGER REFERENCES beneficiaries(beneficiaryid),
            monthlyamount DECIMAL(18, 2) NOT NULL,
            paymentfrequency VARCHAR(20) NOT NULL,
            startdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            enddate TIMESTAMP,
            isactive BOOLEAN DEFAULT TRUE
        );

        -- System Notifications table
        CREATE TABLE IF NOT EXISTS systemnotifications (
            notificationid SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            message VARCHAR(500) NOT NULL,
            type VARCHAR(20) DEFAULT 'info',
            createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            isread BOOLEAN DEFAULT FALSE
        );
    `;

    try {
        await pool.query(createTablesQuery);
        console.log('✓ Tüm tablolar başarıyla oluşturuldu');
        
        // Insert default data if not exists
        await insertDefaultData();
    } catch (err) {
        console.error('Tablolar oluşturulurken hata:', err.message);
    }
}

async function insertDefaultData() {
    try {
        // Check if default branch exists
        const branchCheck = await pool.query('SELECT COUNT(*) FROM branches');
        if (parseInt(branchCheck.rows[0].count) === 0) {
            await pool.query("INSERT INTO branches (branchname, city, country) VALUES ('Merkez Şube', 'Istanbul', 'Turkey')");
            console.log('✓ Varsayılan şube eklendi');
        }

        // Check if aid types exist
        const aidCheck = await pool.query('SELECT COUNT(*) FROM aidtypes');
        if (parseInt(aidCheck.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO aidtypes (aidtypename, description) VALUES 
                ('Gıda', 'Gıda yardımları'),
                ('Giyim', 'Giysi ve kıyafet yardımları'),
                ('Eğitim', 'Eğitim malzemeleri ve burs'),
                ('Sağlık', 'Sağlık hizmetleri ve ilaç'),
                ('Barınma', 'Barınma ve kira yardımı'),
                ('Nakit', 'Nakit para yardımı'),
                ('Diğer', 'Diğer yardım türleri')
            `);
            console.log('✓ Yardım türleri eklendi');
        }

        // Add sample data
        const donorCheck = await pool.query('SELECT COUNT(*) FROM donors');
        if (parseInt(donorCheck.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO donors (firstname, lastname, phonenumber, email, city, country, donortype) VALUES 
                ('Ahmet', 'Yılmaz', '05551234567', 'ahmet@email.com', 'Istanbul', 'Turkey', 'Bireysel'),
                ('Fatma', 'Kaya', '05559876543', 'fatma@email.com', 'Ankara', 'Turkey', 'Bireysel'),
                ('ABC', 'Şirketi', '02121234567', 'info@abc.com', 'Istanbul', 'Turkey', 'Kurumsal')
            `);
            console.log('✓ Örnek bağışçılar eklendi');
        }

        const beneficiaryCheck = await pool.query('SELECT COUNT(*) FROM beneficiaries');
        if (parseInt(beneficiaryCheck.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO beneficiaries (firstname, lastname, phonenumber, city, country, beneficiarytype, familysize) VALUES 
                ('Mehmet', 'Demir', '05551112233', 'Gaziantep', 'Turkey', 'Aile', 5),
                ('Ayşe', 'Çelik', '05554445566', 'Hatay', 'Turkey', 'Yetim', 1),
                ('Ali', 'Öztürk', '05557778899', 'Şanlıurfa', 'Turkey', 'Aile', 4)
            `);
            console.log('✓ Örnek yararlanıcılar eklendi');
        }

        const staffCheck = await pool.query('SELECT COUNT(*) FROM staff');
        if (parseInt(staffCheck.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO staff (firstname, lastname, phonenumber, email, position, department, monthlysalary) VALUES 
                ('Mustafa', 'Şahin', '05551111111', 'mustafa@ihh.org', 'Müdür', 'Yönetim', 15000),
                ('Zeynep', 'Arslan', '05552222222', 'zeynep@ihh.org', 'Koordinatör', 'Yardım', 10000)
            `);
            console.log('✓ Örnek personel eklendi');
        }

    } catch (err) {
        console.error('Varsayılan veriler eklenirken hata:', err.message);
    }
}

async function createNotification({ type = 'info', title, message }) {
    if (!title || !message) return;

    try {
        await pool.query(
            `INSERT INTO ${NOTIFICATIONS_TABLE} (title, message, type) VALUES ($1, $2, $3)`,
            [title, message, type]
        );
    } catch (err) {
        console.error('Bildirim kaydedilemedi:', err.message);
    }
}

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log('✓ PostgreSQL veritabanına başarıyla bağlanıldı');
        client.release();
        await initializeDatabase();
    } catch (err) {
        console.error('✗ Veritabanına bağlanırken hata:', err.message);
        console.log('⚠ Sunucu veritabanı olmadan çalışacak');
    }
}

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM donors WHERE isactive = true) as totaldonors,
                (SELECT COUNT(*) FROM donations) as totaldonations,
                (SELECT COUNT(*) FROM beneficiaries WHERE isactive = true) as totalbeneficiaries,
                (SELECT COUNT(*) FROM staff WHERE isactive = true) as totalstaff,
                (SELECT COALESCE(SUM(donationamount), 0) FROM donations) as totaldonationamount,
                (SELECT COUNT(*) FROM aiddistribution) as totalaiddistributions
        `);

        const row = result.rows[0];
        res.json({
            totalDonors: parseInt(row.totaldonors),
            totalDonations: parseInt(row.totaldonations),
            totalBeneficiaries: parseInt(row.totalbeneficiaries),
            totalStaff: parseInt(row.totalstaff),
            totalDonationAmount: parseFloat(row.totaldonationamount),
            totalAidDistributions: parseInt(row.totalaiddistributions)
        });
    } catch (err) {
        console.error('İstatistikler alınırken hata oluştu:', err);
        res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
    }
});

// Donors
app.get('/api/donors', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                donorid as id,
                firstname as "firstName",
                lastname as "lastName",
                phonenumber as phone,
                email,
                address,
                city,
                country,
                donortype as type,
                TO_CHAR(registrationdate, 'DD/MM/YYYY') as date,
                isactive as "isActive"
            FROM donors
            WHERE isactive = true
            ORDER BY registrationdate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Bağışçılar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bağışçılar alınırken hata oluştu' });
    }
});

app.post('/api/donors', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, email, address, city, country, type } = req.body;

        const result = await pool.query(
            `INSERT INTO donors (firstname, lastname, phonenumber, email, address, city, country, donortype, isactive)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
             RETURNING donorid as id`,
            [firstName, lastName, phone || null, email || null, address || null, city || null, country || 'Turkey', type]
        );

        await createNotification({
            type: 'success',
            title: 'Yeni Bağışçı',
            message: `${firstName} ${lastName} bağışçı olarak eklendi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
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

        await pool.query(
            `UPDATE donors SET
                firstname = $1, lastname = $2, phonenumber = $3, email = $4,
                address = $5, city = $6, country = $7, donortype = $8
             WHERE donorid = $9`,
            [firstName, lastName, phone, email, address, city, country, type, id]
        );

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

        await pool.query('UPDATE donors SET isactive = false WHERE donorid = $1', [id]);

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

// Donations
app.get('/api/donations', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                d.donationid as id,
                d.donorid as "donorId",
                donor.firstname || ' ' || donor.lastname as "donorName",
                d.donationamount as amount,
                d.donationcurrency as currency,
                d.donationtype as type,
                d.paymentmethod as "paymentMethod",
                d.notes,
                TO_CHAR(d.donationdate, 'DD/MM/YYYY') as date
            FROM donations d
            INNER JOIN donors donor ON d.donorid = donor.donorid
            ORDER BY d.donationdate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Bağış kayıtları alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bağış kayıtları alınırken hata oluştu' });
    }
});

app.post('/api/donations', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { donorId, branchId, amount, currency, type, paymentMethod, notes } = req.body;

        const result = await pool.query(
            `INSERT INTO donations (donorid, branchid, donationamount, donationcurrency, donationtype, paymentmethod, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING donationid as id`,
            [donorId, branchId || 1, amount, currency || 'TRY', type, paymentMethod, notes || null]
        );

        await createNotification({
            type: 'success',
            title: 'Yeni Bağış',
            message: `${donorId} numaralı bağışçı için ${amount} ${currency || 'TRY'} tutarında bağış kaydedildi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
            message: 'Bağış başarıyla kaydedildi'
        });
    } catch (err) {
        console.error('Bağış eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bağış eklenirken hata oluştu' });
    }
});

// Beneficiaries
app.get('/api/beneficiaries', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                beneficiaryid as id,
                firstname as "firstName",
                lastname as "lastName",
                phonenumber as phone,
                address,
                city,
                country,
                beneficiarytype as type,
                familysize as "familySize",
                monthlyincome as "monthlyIncome",
                TO_CHAR(registrationdate, 'DD/MM/YYYY') as date,
                isactive as "isActive"
            FROM beneficiaries
            WHERE isactive = true
            ORDER BY registrationdate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Yararlanıcılar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Yararlanıcılar alınırken hata oluştu' });
    }
});

app.post('/api/beneficiaries', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, address, city, country, type, familySize, monthlyIncome } = req.body;

        const result = await pool.query(
            `INSERT INTO beneficiaries (firstname, lastname, phonenumber, address, city, country, beneficiarytype, familysize, monthlyincome, isactive)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
             RETURNING beneficiaryid as id`,
            [firstName, lastName, phone || null, address || null, city || null, country || 'Turkey', type, familySize || 1, monthlyIncome || 0]
        );

        await createNotification({
            type: 'success',
            title: 'Yeni Yararlanıcı',
            message: `${firstName} ${lastName} yararlanıcı olarak eklendi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
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

        await pool.query(
            `UPDATE beneficiaries SET
                firstname = $1, lastname = $2, phonenumber = $3, address = $4,
                city = $5, country = $6, beneficiarytype = $7, familysize = $8, monthlyincome = $9
             WHERE beneficiaryid = $10`,
            [firstName, lastName, phone, address, city, country, type, familySize, monthlyIncome, id]
        );

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

        await pool.query('UPDATE beneficiaries SET isactive = false WHERE beneficiaryid = $1', [id]);

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

// Aid Distributions
app.get('/api/aid-distributions', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                a.distributionid as id,
                a.beneficiaryid as "beneficiaryId",
                b.firstname || ' ' || b.lastname as "beneficiaryName",
                at.aidtypename as "aidType",
                a.quantity,
                a.estimatedvalue as "estimatedValue",
                a.notes,
                TO_CHAR(a.distributiondate, 'DD/MM/YYYY') as date
            FROM aiddistribution a
            INNER JOIN beneficiaries b ON a.beneficiaryid = b.beneficiaryid
            INNER JOIN aidtypes at ON a.aidtypeid = at.aidtypeid
            ORDER BY a.distributiondate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Yardım dağıtımları alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Yardım dağıtımları alınırken hata oluştu' });
    }
});

app.post('/api/aid-distributions', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { beneficiaryId, aidType, quantity, estimatedValue, notes } = req.body;

        const aidTypeResult = await pool.query(
            'SELECT aidtypeid FROM aidtypes WHERE aidtypename = $1',
            [aidType]
        );

        if (aidTypeResult.rows.length === 0) {
            return res.status(400).json({ error: 'Geçersiz yardım türü seçildi' });
        }

        const aidTypeId = aidTypeResult.rows[0].aidtypeid;

        const result = await pool.query(
            `INSERT INTO aiddistribution (beneficiaryid, branchid, aidtypeid, quantity, estimatedvalue, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING distributionid as id`,
            [beneficiaryId, 1, aidTypeId, quantity, estimatedValue || null, notes || null]
        );

        await createNotification({
            type: 'info',
            title: 'Yardım Dağıtımı',
            message: `${beneficiaryId} numaralı yararlanıcı için ${aidType} türünde yardım kaydedildi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
            message: 'Yardım kaydı başarıyla tamamlandı'
        });
    } catch (err) {
        console.error('Yardım kaydedilirken hata oluştu:', err);
        res.status(500).json({ error: 'Yardım kaydedilirken hata oluştu' });
    }
});

// Staff
app.get('/api/staff', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                staffid as id,
                firstname as "firstName",
                lastname as "lastName",
                phonenumber as phone,
                email,
                position,
                department,
                monthlysalary as salary,
                TO_CHAR(hiredate, 'DD/MM/YYYY') as "hireDate",
                isactive as "isActive"
            FROM staff
            WHERE isactive = true
            ORDER BY hiredate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Personel listesi alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Personel listesi alınırken hata oluştu' });
    }
});

app.post('/api/staff', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { firstName, lastName, phone, email, position, department, salary } = req.body;

        const result = await pool.query(
            `INSERT INTO staff (firstname, lastname, phonenumber, email, position, department, monthlysalary, isactive)
             VALUES ($1, $2, $3, $4, $5, $6, $7, true)
             RETURNING staffid as id`,
            [firstName, lastName, phone || null, email || null, position, department || null, salary]
        );

        await createNotification({
            type: 'success',
            title: 'Yeni Personel',
            message: `${firstName} ${lastName} personel olarak eklendi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
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

        await pool.query(
            `UPDATE staff SET
                firstname = $1, lastname = $2, phonenumber = $3, email = $4,
                position = $5, department = $6, monthlysalary = $7
             WHERE staffid = $8`,
            [firstName, lastName, phone, email, position, department || null, salary, id]
        );

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

        await pool.query('UPDATE staff SET isactive = false WHERE staffid = $1', [id]);

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

// Sponsorships
app.get('/api/sponsorships', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                s.sponsorshipid as id,
                s.donorid as "donorId",
                d.firstname || ' ' || d.lastname as "donorName",
                s.beneficiaryid as "orphanId",
                b.firstname || ' ' || b.lastname as "orphanName",
                s.monthlyamount as "monthlyAmount",
                s.paymentfrequency as "paymentFrequency",
                s.isactive as "isActive",
                TO_CHAR(s.startdate, 'DD/MM/YYYY') as "startDate"
            FROM orphansponsorship s
            INNER JOIN donors d ON s.donorid = d.donorid
            INNER JOIN beneficiaries b ON s.beneficiaryid = b.beneficiaryid
            ORDER BY s.startdate DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Sponsorluklar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Sponsorluklar alınırken hata oluştu' });
    }
});

app.post('/api/sponsorships', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { donorId, beneficiaryId, monthlyAmount, paymentFrequency } = req.body;

        const result = await pool.query(
            `INSERT INTO orphansponsorship (donorid, beneficiaryid, monthlyamount, paymentfrequency, isactive)
             VALUES ($1, $2, $3, $4, true)
             RETURNING sponsorshipid as id`,
            [donorId, beneficiaryId, monthlyAmount, paymentFrequency]
        );

        await createNotification({
            type: 'success',
            title: 'Yeni Sponsorluk',
            message: `${donorId} numaralı bağışçı için sponsorluk kaydedildi`
        });

        res.json({
            success: true,
            id: result.rows[0].id,
            message: 'Sponsorluk başarıyla kaydedildi'
        });
    } catch (err) {
        console.error('Sponsorluk eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sponsorluk eklenirken hata oluştu' });
    }
});

// Reports
app.get('/api/reports', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const statsResult = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM donors WHERE isactive = true) as totaldonors,
                (SELECT COUNT(*) FROM beneficiaries WHERE isactive = true) as totalbeneficiaries,
                (SELECT COALESCE(SUM(donationamount), 0) FROM donations) as totaldonationamount,
                (SELECT COUNT(*) FROM aiddistribution) as totalaiddistributions
        `);

        const topDonorsResult = await pool.query(`
            SELECT
                d.firstname || ' ' || d.lastname as "donorName",
                COUNT(dn.donationid) as "donationCount",
                SUM(dn.donationamount) as "totalAmount"
            FROM donors d
            INNER JOIN donations dn ON d.donorid = dn.donorid
            WHERE d.isactive = true
            GROUP BY d.donorid, d.firstname, d.lastname
            ORDER BY "totalAmount" DESC
            LIMIT 10
        `);

        const aidByTypeResult = await pool.query(`
            SELECT
                at.aidtypename as "aidType",
                COUNT(ad.distributionid) as count,
                COALESCE(SUM(ad.estimatedvalue), 0) as "totalValue"
            FROM aidtypes at
            LEFT JOIN aiddistribution ad ON at.aidtypeid = ad.aidtypeid
            GROUP BY at.aidtypename
            ORDER BY count DESC
        `);

        const stats = statsResult.rows[0];
        res.json({
            totalDonors: parseInt(stats.totaldonors),
            totalBeneficiaries: parseInt(stats.totalbeneficiaries),
            totalDonationAmount: parseFloat(stats.totaldonationamount),
            totalAidDistributions: parseInt(stats.totalaiddistributions),
            topDonors: topDonorsResult.rows,
            aidByType: aidByTypeResult.rows
        });
    } catch (err) {
        console.error('Raporlar alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Raporlar alınırken hata oluştu' });
    }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const result = await pool.query(`
            SELECT
                notificationid as id,
                title,
                message,
                type,
                isread as "isRead",
                createdat as "createdAt"
            FROM ${NOTIFICATIONS_TABLE}
            ORDER BY createdat DESC
            LIMIT 20
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Bildirimler alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirimler alınırken hata oluştu' });
    }
});

app.post('/api/notifications/:id/read', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE ${NOTIFICATIONS_TABLE} SET isread = true WHERE notificationid = $1`,
            [id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Bildirim durumu güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirim durumu güncellenirken hata oluştu' });
    }
});

app.post('/api/notifications/read-all', async (req, res) => {
    if (!ensurePool(res)) return;
    try {
        await pool.query(`UPDATE ${NOTIFICATIONS_TABLE} SET isread = true WHERE isread = false`);
        res.json({ success: true });
    } catch (err) {
        console.error('Bildirimler güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Bildirimler güncellenirken hata oluştu' });
    }
});

// Start server
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
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
    await pool.end();
    console.log('✓ Veritabanı bağlantısı kapatıldı');
    console.log('✓ Sunucu başarıyla durduruldu\n');
    process.exit(0);
});
