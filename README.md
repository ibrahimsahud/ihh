# IHH Yardim Yönetim Sistemi

IHH yardim operasyonlarini yonetmek icin bagiscilar, bagislar, faydalanicilar, personel ve kefalet sureclerini kapsayan tam kapsamli bir uygulama.

## 👨‍💻 Gelistiriciler

- **Ibrahim Sahud** - ibrahim.sahud@ogr.dpu.edu.tr (202013172164)
- **Ahmet Kassas** - ahmet.kassas@ogr.dpu.edu.tr (112113172064)

**Dumlupinar Universitesi** - Veritabani Yonetim Sistemleri (131725123)

---

## 📋 Gereksinimler

- **Node.js** 14.0.0 veya uzeri
- **npm** 6.0.0 veya uzeri
- **SQL Server** (herhangi bir surum)
- **Windows Authentication** veya SQL Server Authentication

---

## 🚀 Kurulum ve Ayar

### 1. Gerekli paketleri kurun

```bash
npm install
```

### 2. Veritabani hazirligi

#### A. Veritabani olusturma

1. **SQL Server Management Studio** (SSMS) uygulamasini acin.
2. `database-schema.sql` dosyasini calistirarak veritabani ve tablolar olusturun.

#### B. Baglanti ayarlarini guncelleyin

Varsayilan ayarlar:
- Sunucu: `IBOO`
- Kullanici: `IBOO\\iboo`
- Veritabani: `IHH_Hayir`
- Kimlik dogrulama: Windows Authentication

Farkli bilgiler kullaniyorsaniz su dosyalari guncelleyin:

**`database.js`** satir 5-18
**`server.js`** satir 16-31

```javascript
const config = {
    user: 'kullanici_adi',
    password: 'sifre',
    server: 'sunucu_adi',
    database: 'IHH_Hayir',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    port: 1433
};
```

### 3. Veritabani baglantisini test edin

```bash
npm test
```

Bu komut `test-connection.js` dosyasini calistirarak baglantiyi dogrular.

### 4. Uygulamayi calistirin

#### Uretim:
```bash
npm start
```

#### Gelistirme (otomatik yeniden baslatma):
```bash
npm run dev
```

### 5. Uygulamayi acin

Tarayicida su adrese gidin:
```
http://localhost:3000
```

---

## 📁 Proje yapisi

```

├── public/              # Arayuz dosyalari (HTML, CSS, JS)
├── node_modules/        # Yuklu paketler
├── database.js          # Veritabani baglanti modulu
├── server.js            # Express.js sunucusu ve API'ler
├── database-schema.sql  # Veritabani kurulum betigi
├── test-connection.js   # Baglanti testi betigi
├── package.json         # Proje ve bagimlilik bilgisi
└── README.md            # Bu dosya
```

---

## 🔧 Sik karsilasilan sorunlar

### Veritabani baglanti hatasi

1. **SQL Server calisiyor mu?**
   - **SQL Server Configuration Manager** aracini acin.
   - SQL Server servisinin calistigini dogrulayin.

2. **TCP/IP etkin mi?**
   - SQL Server Configuration Manager → SQL Server Network Configuration → Protocols for [Instance Name]
   - TCP/IP secenegini Etkin durumuna getirin.

3. **Sunucu adini kontrol edin:**
   - SSMS uzerinden baglanirken kullandiginiz sunucu adini gorun.
   - Ayni adi ayar dosyasina yazin.

4. **Kullanici yetkileri:**
   - Hesabin veritabani uzerinde yeterli yetkiye sahip oldugundan emin olun.

---

## 📊 Temel ozellikler

### 1. Bagisci yonetimi
- Bagisci ekleme, duzenleme ve silme
- Bagiscilari birey, sirket veya vakif olarak siniflandirma
- Her bagiscinin bagis kaydini goruntuleme

### 2. Bagis yonetimi
- Farkli para birimleriyle kayit
- Bagis turlerini ayirma
- Coklu odeme yontemi destegi
- Makbuz olusturma

### 3. Faydalanici yonetimi
- Hizmet alan kisileri kaydetme
- Tur bazli siniflandirma
- Aile buyuklugu ve aylik gelir takibi

### 4. Yardim dagitimi
- Dagitim kayitlari olusturma
- Yardim turlerini siniflandirma
- Tahmini deger hesaplama

### 5. Personel yonetimi
- Personel kayitlari
- Departman ve pozisyon bilgileri
- Maas takibi

### 6. Yetim sponsorligi
- Bagiscilarla yetimleri eslestirme
- Aylik sponsorluk takibi
- Odeme periyodu kontrolleri

### 7. Raporlar ve istatistikler
- Genel istatistikler
- One cikan bagiscilar
- Tur bazli yardim dagilimi

---

## 🔐 Guvenlik notlari

- Proje Windows Authentication kullanir.
- Uretim ortaminda hassas verileri sifreleyin.
- Veritabani icin duzenli yedek almayi unutmayin.

---

## 📝 Lisans

MIT License - projeyi ozgurlukle kullanip degistirebilirsiniz.

---

## 📞 Destek

Sorulariniz icin yukaridaki e-posta adresleri uzerinden gelistiricilerle iletisime gecebilirsiniz.

---

**Dumlupinar Universitesi icin 2025 yilinda ozenle gelistirilmistir.**
