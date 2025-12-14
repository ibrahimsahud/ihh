-- Veritabanindaki tum tablolar ve sutunlari listeleme sorgusu
USE IHH_Hayir;
GO

SELECT
    t.TABLE_NAME as 'Table Name',
    c.COLUMN_NAME as 'Column Name',
    c.DATA_TYPE as 'Data Type',
    c.CHARACTER_MAXIMUM_LENGTH as 'Max Length',
    c.IS_NULLABLE as 'Nullable'
FROM
    INFORMATION_SCHEMA.TABLES t
INNER JOIN
    INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
WHERE
    t.TABLE_TYPE = 'BASE TABLE'
    AND t.TABLE_SCHEMA = 'dbo'
ORDER BY
    t.TABLE_NAME,
    c.ORDINAL_POSITION;
