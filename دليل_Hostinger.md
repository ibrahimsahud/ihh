# 🚀 دليل النشر على Hostinger - خطوة بخطوة

## ✅ الخطوات الكاملة

---

## 📋 المرحلة 1: إنشاء قاعدة البيانات على Hostinger

### 1. تسجيل الدخول إلى Hostinger
- اذهب إلى: https://hpanel.hostinger.com
- سجّل الدخول بحسابك

### 2. إنشاء قاعدة بيانات MySQL
1. من لوحة التحكم (hPanel)
2. اختر **"Databases"** أو **"قواعد البيانات"**
3. اضغط **"Create New Database"** أو **"إنشاء قاعدة بيانات جديدة"**

### 3. معلومات قاعدة البيانات
املأ الحقول:
- **Database Name:** `ihh_hayir` (أو أي اسم تريده)
- **Username:** سيتم إنشاؤه تلقائياً (أو أنشئ واحد جديد)
- **Password:** اختر كلمة مرور قوية

اضغط **"Create"**

### 4. حفظ معلومات الاتصال

ستحصل على:
```
Database Name: u123456789_ihh_hayir
Username: u123456789_ihhuser
Password: YourPassword123!
Host/Server: localhost (أو mysql.hostinger.com أو IP معين)
Port: 3306
```

**⚠️ احفظ هذه المعلومات! ستحتاجها لاحقاً**

---

## 💾 المرحلة 2: رفع قاعدة البيانات

### الطريقة 1: عبر phpMyAdmin (الأسهل)

1. **فتح phpMyAdmin:**
   - من hPanel → Databases
   - اضغط **"phpMyAdmin"** أمام قاعدة البيانات

2. **استيراد SQL:**
   - اختر قاعدة البيانات من القائمة اليسرى
   - اضغط تبويب **"Import"** أو **"استيراد"**
   - اضغط **"Choose File"**
   - اختر ملف `HOSTINGER_MYSQL_SETUP.sql`
   - اضغط **"Go"** أو **"تنفيذ"**

3. **انتظر حتى الانتهاء:**
   ```
   ✅ Import has been successfully finished
   ```

### الطريقة 2: عبر Query Editor

1. **فتح قاعدة البيانات:**
   - من hPanel → Databases
   - اضغط **"Manage"** أمام قاعدة البيانات
   - اضغط **"Enter phpMyAdmin"**

2. **تشغيل SQL:**
   - اختر قاعدة البيانات
   - اضغط تبويب **"SQL"**
   - افتح ملف `HOSTINGER_MYSQL_SETUP.sql`
   - انسخ **جميع** المحتوى
   - الصقه في صندوق SQL
   - اضغط **"Go"**

---

## 🌐 المرحلة 3: رفع المشروع

### الخيار A: رفع على Hostinger Web Hosting

إذا كان لديك **Web Hosting** من Hostinger:

1. **رفع الملفات:**
   - من hPanel → **"File Manager"**
   - اذهب إلى مجلد `public_html`
   - احذف ملفات `index.html` الافتراضية
   - ارفع جميع ملفات مشروعك

2. **تثبيت Node.js:**
   - Hostinger يدعم Node.js على بعض الباقات
   - من hPanel → **"Advanced"** → **"Node.js"**
   - فعّل Node.js
   - اختر نسخة Node.js 18 أو أحدث

3. **إعداد Environment Variables:**
   - في إعدادات Node.js
   - أضف المتغيرات (سنشرحها لاحقاً)

### الخيار B: رفع على GitHub + Render (الأفضل)

**هذا هو الخيار الموصى به:**

1. **رفع على GitHub** (كما شرحنا سابقاً)
2. **استخدام Render.com** للـ Backend
3. **قاعدة البيانات على Hostinger**

---

## 🔧 المرحلة 4: تعديل ملفات المشروع

### 1. تحديث database.js للعمل مع MySQL

أنشئ ملف `database-mysql.js`:

```javascript
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'IHH_Hayir',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

async function connectToDatabase() {
    try {
        pool = mysql.createPool(config);
        // اختبار الاتصال
        const connection = await pool.getConnection();
        console.log('✓ Veritabani baglantisi basarili (MySQL)');
        connection.release();
        return pool;
    } catch (err) {
        console.error('✗ Veritabani baglantisi hatasi:', err.message);
        throw err;
    }
}

function getPool() {
    return pool;
}

module.exports = {
    connectToDatabase,
    getPool
};
```

### 2. تحديث .env.example

```env
# Database Configuration (MySQL/Hostinger)
DB_HOST=localhost
DB_USER=u123456789_ihhuser
DB_PASSWORD=YourPassword123!
DB_NAME=u123456789_ihh_hayir
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=production
```

---

## 🎯 المرحلة 5: النشر على Render + Hostinger

### إعدادات Render.com:

**Environment Variables:**

```
DB_HOST=mysql.hostinger.com (أو localhost أو IP)
DB_USER=u123456789_ihhuser
DB_PASSWORD=YourPassword123!
DB_NAME=u123456789_ihh_hayir
DB_PORT=3306
NODE_ENV=production
PORT=10000
```

**⚠️ مهم:** تأكد من أن Hostinger يسمح بالاتصالات الخارجية (Remote MySQL)

### تفعيل Remote MySQL في Hostinger:

1. من hPanel → **Databases**
2. اختر قاعدة البيانات
3. اضغط **"Remote MySQL"**
4. أضف IP address أو استخدم `%` للسماح بجميع الاتصالات
5. احفظ الإعدادات

---

## 📊 التحقق من البيانات

بعد رفع SQL، تحقق من الجداول:

```sql
-- في phpMyAdmin، اذهب إلى تبويب SQL واكتب:

SHOW TABLES;

-- يجب أن ترى 9 جداول:
-- Branches
-- Donors
-- Beneficiaries
-- Staff
-- Donations
-- AidTypes
-- AidDistribution
-- OrphanSponsorship
-- Notifications

-- للتحقق من البيانات:
SELECT COUNT(*) FROM Donors;
SELECT COUNT(*) FROM Beneficiaries;
SELECT COUNT(*) FROM Donations;
```

**النتيجة المتوقعة:**
- Branches: 5 سجلات
- Donors: 8 سجلات
- Beneficiaries: 8 سجلات
- Staff: 6 سجلات
- Donations: 10 سجلات
- AidTypes: 10 سجلات
- AidDistribution: 10 سجلات
- OrphanSponsorship: 5 سجلات
- Notifications: 4 سجلات

---

## ⚙️ الإعدادات النهائية

### معلومات الاتصال من Hostinger:

بعد إنشاء قاعدة البيانات، احصل على:

```
Server/Host: ___________________________
Database Name: ___________________________
Username: ___________________________
Password: ___________________________
Port: 3306
```

### استخدام المعلومات في Render:

```
DB_HOST=السيرفر_من_هوستنجر
DB_USER=اسم_المستخدم_من_هوستنجر
DB_PASSWORD=كلمة_المرور_من_هوستنجر
DB_NAME=اسم_قاعدة_البيانات_من_هوستنجر
DB_PORT=3306
```

---

## 🎉 الخلاصة

### الهيكل النهائي:

1. **قاعدة البيانات:** Hostinger MySQL
2. **Backend + Frontend:** Render.com
3. **الكود:** GitHub

### خطوات النشر:

1. ✅ إنشاء قاعدة بيانات على Hostinger
2. ✅ رفع `HOSTINGER_MYSQL_SETUP.sql` عبر phpMyAdmin
3. ✅ رفع الكود على GitHub
4. ✅ نشر التطبيق على Render.com
5. ✅ ربط Render بقاعدة بيانات Hostinger

---

## 🆘 حل المشاكل

### المشكلة: Cannot connect to MySQL server

**الحل:**
1. تحقق من تفعيل Remote MySQL في Hostinger
2. تأكد من صحة Host/Server name
3. تأكد من صحة Username وPassword

### المشكلة: Access denied for user

**الحل:**
1. تحقق من Username وPassword
2. تأكد من أن المستخدم لديه صلاحيات على قاعدة البيانات
3. في Hostinger → Databases → Manage → Add User

### المشكلة: Table doesn't exist

**الحل:**
- شغّل `HOSTINGER_MYSQL_SETUP.sql` مرة أخرى
- تأكد من اختيار قاعدة البيانات الصحيحة في phpMyAdmin

---

## 📞 الدعم

- Hostinger Support: https://www.hostinger.com/tutorials
- Render Docs: https://render.com/docs
- MySQL Docs: https://dev.mysql.com/doc/

---

**تم! قاعدة بياناتك الآن جاهزة على Hostinger! 🚀**
