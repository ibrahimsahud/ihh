-- SQL Server icin uzaktan erisimi etkinlestirme
-- Bu betigi SSMS uzerinde calistirin

EXEC sys.sp_configure N'remote access', N'1'
GO
RECONFIGURE WITH OVERRIDE
GO

-- Mevcut ayarlari goruntule
EXEC sys.sp_configure N'remote access'
GO
