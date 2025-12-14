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

async function checkSchema() {
    try {
        await sql.connect(config);

        console.log('\n=== Veritabani semasi kontrolu ===\n');

        // Get all tables
        const tables = await sql.query(`
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'dbo'
            ORDER BY TABLE_NAME
        `);

        console.log('Mevcut tablolar:');
        for (let table of tables.recordset) {
            console.log(`\nTablo: ${table.TABLE_NAME}`);

            // Get columns for each table
            const columns = await sql.query(`
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${table.TABLE_NAME}'
                ORDER BY ORDINAL_POSITION
            `);

            console.log('   Sutunlar:');
            for (let col of columns.recordset) {
                const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
                console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${length}`);
            }
        }

        await sql.close();
    } catch (err) {
        console.error('Hata:', err);
    }
}

checkSchema();
