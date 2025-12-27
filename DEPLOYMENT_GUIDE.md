# 🚀 دليل نشر مشروع IHH على الإنترنت

## المتطلبات
- حساب GitHub
- حساب على منصة استضافة (Render.com أو Railway.app)
- قاعدة بيانات SQL مجانية

---

## 📋 خطوات النشر

### 1️⃣ رفع الكود على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ibrahimsahud/ihh.git
git push -u origin main
```

---

### 2️⃣ إنشاء قاعدة بيانات مجانية

#### الخيار أ: Azure SQL Database
1. اذهب إلى: https://portal.azure.com
2. أنشئ حساب مجاني
3. أنشئ SQL Database جديد
4. اختر Basic tier (مجاني)
5. احفظ معلومات الاتصال:
   - Server name
   - Database name
   - Username
   - Password

#### الخيار ب: FreeSQLDatabase.com
1. اذهب إلى: http://www.freesqldatabase.com
2. سجل حساب جديد
3. أنشئ قاعدة بيانات
4. احفظ معلومات الاتصال

---

### 3️⃣ نشر التطبيق على Render.com

1. **إنشاء حساب:**
   - اذهب إلى: https://render.com
   - سجل حساب باستخدام GitHub

2. **إنشاء Web Service:**
   - اضغط "New +" → "Web Service"
   - اختر مستودع GitHub الخاص بك
   - الإعدادات:
     - **Name:** ihh-system
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **إضافة متغيرات البيئة:**
   اضغط "Environment" وأضف:
   ```
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_SERVER=your_database_server.database.windows.net
   DB_NAME=IHH_Hayir
   DB_ENCRYPT=true
   DB_TRUST_CERT=true
   PORT=10000
   NODE_ENV=production
   ```

4. **انشر التطبيق:**
   - اضغط "Create Web Service"
   - انتظر حتى ينتهي النشر
   - ستحصل على رابط مثل: `https://ihh-system.onrender.com`

---

### 4️⃣ تشغيل الـ SQL Scripts على قاعدة البيانات

استخدم SQL Server Management Studio أو Azure Data Studio:

1. اتصل بقاعدة البيانات المجانية
2. شغّل الملفات بالترتيب:
   ```sql
   -- 1. إنشاء الجداول
   CREATE_TABLES.sql
   
   -- 2. إضافة البيانات الأساسية
   setup-basic-data.js (أو نسخة SQL منه)
   ```

---

### 5️⃣ البدائل الأخرى

#### Railway.app
```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init

# نشر التطبيق
railway up
```

#### Vercel (للفرونت إند فقط)
```bash
# تثبيت Vercel CLI
npm install -g vercel

# نشر
vercel
```

---

## 🔧 ملاحظات مهمة

1. **الأمان:**
   - لا ترفع ملف `.env` على GitHub
   - استخدم متغيرات البيئة في منصة الاستضافة

2. **قاعدة البيانات:**
   - غيّر معلومات الاتصال في ملف `database.js`
   - أو استخدم متغيرات البيئة (موصى به)

3. **الأداء:**
   - الخطة المجانية قد تكون بطيئة
   - قد يتوقف السيرفر بعد 15 دقيقة من عدم النشاط (في Render)

---

## 📞 الدعم

- Render Docs: https://render.com/docs
- Azure SQL Docs: https://docs.microsoft.com/azure/sql-database/
- Railway Docs: https://docs.railway.app/

---

## ✅ اختبار التطبيق

بعد النشر:
1. افتح الرابط الذي حصلت عليه
2. اختبر جميع الميزات
3. تأكد من الاتصال بقاعدة البيانات

---

**تم بنجاح! 🎉**
