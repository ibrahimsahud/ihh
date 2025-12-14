const sql = require('mssql');

const config = {
    user: 'ihhuser',
    password: 'IHH@2025',
    server: 'IBOO',
    database: 'IHH_Hayir',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function setupBasicData() {
    try {
        await sql.connect(config);
        console.log('Baglanti basarili\n');

        // Check if Branches table has data
        const branchCount = await sql.query('SELECT COUNT(*) as Total FROM Branches');
        console.log('Sube sayisi:', branchCount.recordset[0].Total);

        if (branchCount.recordset[0].Total === 0) {
            console.log('Varsayilan sube ekleniyor...');
            await sql.query(`
                INSERT INTO Branches (BranchName, BranchCity, BranchAddress, PhoneNumber, Email, IsActive)
                VALUES ('Istanbul Merkez Subesi', 'Istanbul', 'Fatih, Istanbul', '+90 212 123 4567', 'istanbul@ihh.org.tr', 1)
            `);
            console.log('   Varsayilan sube eklendi');
        }

        // Check if AidTypes table has data
        const aidTypesCount = await sql.query('SELECT COUNT(*) as Total FROM AidTypes');
        console.log('\nYardim turu sayisi:', aidTypesCount.recordset[0].Total);

        if (aidTypesCount.recordset[0].Total === 0) {
            console.log('Varsayilan yardim turleri ekleniyor...');
            await sql.query(`
                INSERT INTO AidTypes (AidTypeName, Description, Category, IsActive) VALUES
                ('Gida Paketi', 'Temel erzaklardan olusan aylik paket', 'Food', 1),
                ('Tibbi Destek', 'Hastalar icin tibbi malzeme', 'Medical', 1),
                ('Egitim Seti', 'Okul cantasi ve kiyafet destegi', 'Education', 1),
                ('Acil Nakit', 'Acil durumlar icin finansman', 'Emergency', 1)
            `);
            console.log('   Varsayilan yardim turleri eklendi');
        }

        console.log('\nTemel veriler hazir');
        console.log('\nOzet:');

        const summary = await sql.query(`
            SELECT
                (SELECT COUNT(*) FROM Branches WHERE IsActive = 1) as Branches,
                (SELECT COUNT(*) FROM AidTypes WHERE IsActive = 1) as AidTypes,
                (SELECT COUNT(*) FROM Donors WHERE IsActive = 1) as Donors,
                (SELECT COUNT(*) FROM Beneficiaries WHERE IsActive = 1) as Beneficiaries,
                (SELECT COUNT(*) FROM Staff WHERE IsActive = 1) as Staff
        `);

        const stats = summary.recordset[0];
        console.log(`   - Subeler: ${stats.Branches}`);
        console.log(`   - Yardim turleri: ${stats.AidTypes}`);
        console.log(`   - Bagiscilar: ${stats.Donors}`);
        console.log(`   - Faydalanicilar: ${stats.Beneficiaries}`);
        console.log(`   - Personel: ${stats.Staff}`);

        await sql.close();
    } catch (err) {
        console.error('✗ Hata:', err.message);
    }
}

setupBasicData();
