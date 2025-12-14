const { testConnection } = require('./database');

(async () => {
    console.log('Veritabani baglantisi test ediliyor...');
    try {
        const ok = await testConnection();
        if (ok) {
            console.log('Baglanti testi basariyla tamamlandi.');
            process.exit(0);
        } else {
            console.error('Baglanti testi basarisiz oldu.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Baglanti testi sirasinda hata:', err.message);
        process.exit(1);
    }
})();
