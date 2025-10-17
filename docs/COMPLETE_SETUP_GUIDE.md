# 📦 دليل التجهيز الكامل - Azab Maintenance System

**الإصدار:** 2.0  
**تاريخ التحديث:** 17 أكتوبر 2025  
**مدير الحزم:** pnpm (مُوصى به)

---

## 🎯 نظرة عامة

هذا الدليل يغطي التجهيز الكامل للمشروع من البداية حتى النشر، باستخدام **pnpm** كمدير حزم موحد على مستوى جميع الخدمات.

### لماذا pnpm؟

- ⚡ أسرع من npm بـ 2x
- 💾 يوفر مساحة القرص (Symbolic links)
- 🔒 أكثر أماناً (strict dependency resolution)
- 🎯 دعم Monorepos بشكل أفضل
- 📦 متوافق 100% مع npm

---

## 📋 المتطلبات الأساسية

### 1. البرامج المطلوبة

```bash
# Node.js (الإصدار 18 أو أحدث)
node --version  # يجب أن يكون >= 18.0.0

# تثبيت pnpm عالمياً
npm install -g pnpm

# التحقق من التثبيت
pnpm --version  # يجب أن يكون >= 8.0.0

# Git (لإدارة الإصدارات)
git --version
```

### 2. حساب Supabase

- مشروع Supabase نشط
- Project ID: `zrrffsjbfkphridqyais`
- Supabase URL و Anon Key

### 3. حساب Google Cloud (للخرائط)

- Google Maps API Key مع تفعيل:
  - Maps JavaScript API
  - Geocoding API
  - Places API

---

## 🚀 التجهيز الأولي

### الخطوة 1: استنساخ المشروع

```bash
# من GitHub
git clone https://github.com/your-username/azab-maintenance.git
cd azab-maintenance

# أو تحميل من Lovable
# Export to GitHub → Clone locally
```

### الخطوة 2: إعداد pnpm Workspace

```bash
# إنشاء ملف pnpm-workspace.yaml في الجذر
cat > pnpm-workspace.yaml << EOF
packages:
  - 'frontend'
  - 'supabase/functions/*'
EOF

# إنشاء ملف .npmrc للتكوين
cat > .npmrc << EOF
# استخدام pnpm على مستوى المشروع
package-manager=pnpm
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true

# تسريع التثبيت
prefer-offline=true
fetch-retries=5
fetch-timeout=60000

# Capacitor compatibility
node-linker=hoisted
EOF
```

### الخطوة 3: تثبيت التبعيات

```bash
# تثبيت جميع التبعيات دفعة واحدة
pnpm install

# أو تثبيت Frontend فقط
cd frontend
pnpm install
cd ..

# التحقق من عدم وجود أخطاء
pnpm list
```

**الوقت المتوقع:** 1-3 دقائق (بدلاً من 5+ دقائق مع npm)

### الخطوة 4: إعداد المتغيرات البيئية

```bash
# إنشاء ملف .env في الجذر
cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="zrrffsjbfkphridqyais"
VITE_SUPABASE_URL="https://zrrffsjbfkphridqyais.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycmZmc2piZmtwaHJpZHF5YWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzE1NzMsImV4cCI6MjA3MjAwNzU3M30.AwzY48mSUGeopBv5P6gzAPlipTbQasmXK8DR-L_Tm9A"

# Google Maps (سيتم جلبها من Edge Function)
# VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Development
NODE_ENV=development
EOF

# نسخ إلى مجلد frontend أيضاً
cp .env frontend/.env

# إضافة .env إلى .gitignore
echo ".env" >> .gitignore
echo "frontend/.env" >> .gitignore
```

### الخطوة 5: إعداد Git

```bash
# إذا لم يكن Git مُهيأ
git init
git add .
git commit -m "Initial commit with pnpm setup"

# ربط مع GitHub (اختياري)
git remote add origin https://github.com/your-username/azab-maintenance.git
git push -u origin main
```

---

## 🛠️ تجهيز Supabase

### 1. إنشاء قاعدة البيانات

قاعدة البيانات موجودة بالفعل، لكن للتأكد:

```bash
# التحقق من الاتصال
pnpm run test:db

# أو يدوياً في Supabase Dashboard:
# https://supabase.com/dashboard/project/zrrffsjbfkphridqyais
```

### 2. تفعيل RLS Policies

```sql
-- التحقق من تفعيل RLS على الجداول الحساسة
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- يجب أن تكون rowsecurity = true للجداول:
-- - profiles
-- - maintenance_requests
-- - properties
-- - invoices
```

### 3. نشر Edge Functions

```bash
# تسجيل الدخول إلى Supabase
npx supabase login

# ربط المشروع
npx supabase link --project-ref zrrffsjbfkphridqyais

# نشر جميع Functions
npx supabase functions deploy

# أو نشر function معينة
npx supabase functions deploy chatbot
npx supabase functions deploy send-notification
npx supabase functions deploy get-maps-key
npx supabase functions deploy error-tracking
npx supabase functions deploy send-invoice-email
```

### 4. إعداد Secrets للـ Edge Functions

```bash
# في Supabase Dashboard → Edge Functions → Secrets
# أضف:
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key (اختياري)
DEEPSEEK_API_KEY=your_deepseek_key (للـ Chatbot)
RESEND_API_KEY=your_resend_key (للإيميلات)
```

---

## 📱 تجهيز تطبيق Android

### الخطوة 1: المتطلبات

```bash
# تثبيت Capacitor CLI
pnpm add -g @capacitor/cli

# تثبيت Android Studio
# تحميل من: https://developer.android.com/studio

# تثبيت JDK 11
# Windows: https://adoptium.net/
# Mac: brew install openjdk@11
# Linux: sudo apt install openjdk-11-jdk
```

### الخطوة 2: إضافة منصة Android

```bash
# تهيئة Capacitor (إذا لم يكن مُهيأ)
pnpm exec cap init

# إعداد capacitor.config.ts
cat > capacitor.config.ts << EOF
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alazab.maintenance',
  appName: 'Azab Maintenance',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // للتطوير فقط - احذف قبل النشر
    url: 'https://c6adaf51-0eef-43e8-bf45-d65ac7ebe1aa.lovableproject.com',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f5bf23",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
EOF

# إضافة منصة Android
pnpm exec cap add android

# تحديث التبعيات
pnpm exec cap update android
```

### الخطوة 3: بناء التطبيق

```bash
# بناء الواجهة
pnpm run build

# مزامنة مع Android
pnpm exec cap sync android

# فتح في Android Studio
pnpm exec cap open android
```

### الخطوة 4: تشغيل على الجهاز

```bash
# تشغيل على Emulator أو جهاز حقيقي
pnpm exec cap run android

# أو من Android Studio:
# Run → Run 'app'
```

---

## 🌐 التشغيل المحلي (Development)

### تشغيل Frontend فقط

```bash
# طريقة 1: من الجذر
pnpm run dev

# طريقة 2: من مجلد frontend
cd frontend
pnpm run dev

# الوصول على:
# http://localhost:8080
```

### تشغيل مع Hot Reload على Mobile

```bash
# 1. تأكد أن server.url مُعد في capacitor.config.ts
# 2. تشغيل dev server
pnpm run dev

# 3. مزامنة
pnpm exec cap sync android

# 4. تشغيل التطبيق
pnpm exec cap run android

# الآن أي تغيير في الكود سيظهر مباشرة على الجهاز!
```

---

## 🧪 الاختبار الشامل

### 1. اختبار Frontend

```bash
# تشغيل صفحة الاختبار
pnpm run dev

# افتح المتصفح على:
# http://localhost:8080/testing
```

### 2. اختبار Database

```bash
# التحقق من الاتصال
pnpm run test:supabase

# أو يدوياً:
# انتقل إلى Supabase Dashboard → SQL Editor
# نفذ: SELECT * FROM profiles LIMIT 5;
```

### 3. اختبار Edge Functions

```bash
# في Supabase Dashboard → Edge Functions → Logs
# راقب السجلات أثناء استخدام التطبيق
```

### 4. اختبار Mobile

```bash
# تشغيل على emulator
pnpm exec cap run android --target=emulator-5554

# تشغيل على جهاز حقيقي
pnpm exec cap run android --target=device-id
```

---

## 📦 البناء للإنتاج

### Frontend (Web)

```bash
# بناء Production
pnpm run build

# معاينة البناء
pnpm run preview

# الملفات في: dist/
```

### Android App Bundle (للنشر على Play Store)

```bash
# 1. حذف server config من capacitor.config.ts
# احذف كتلة "server" بالكامل

# 2. بناء Frontend
pnpm run build

# 3. مزامنة
pnpm exec cap sync android

# 4. في Android Studio:
# Build → Generate Signed Bundle / APK → Android App Bundle (AAB)

# 5. ملف AAB في:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🚀 النشر

### 1. النشر على Vercel (Web)

```bash
# تثبيت Vercel CLI
pnpm add -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# للإنتاج
vercel --prod
```

**Environment Variables في Vercel:**
```
VITE_SUPABASE_URL=https://zrrffsjbfkphridqyais.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### 2. النشر على Google Play (Android)

راجع [GOOGLE_PLAY_DEPLOYMENT.md](./GOOGLE_PLAY_DEPLOYMENT.md) للتفاصيل الكاملة.

**خطوات سريعة:**

1. إنشاء حساب Google Play Console ($25)
2. توقيع التطبيق بـ Keystore
3. بناء AAB موقّع
4. رفع إلى Play Console
5. ملء معلومات المتجر
6. نشر!

---

## 🔧 أوامر pnpm الشائعة

### إدارة التبعيات

```bash
# تثبيت حزمة جديدة
pnpm add package-name

# تثبيت حزمة dev
pnpm add -D package-name

# تثبيت حزمة عالمية
pnpm add -g package-name

# تحديث جميع الحزم
pnpm update

# تحديث حزمة معينة
pnpm update package-name

# حذف حزمة
pnpm remove package-name

# تنظيف cache
pnpm store prune
```

### إدارة Workspace

```bash
# تشغيل أمر في workspace معين
pnpm --filter frontend run build

# تشغيل أمر في جميع workspaces
pnpm -r run test

# تثبيت تبعيات جميع workspaces
pnpm install -r
```

### أوامر مخصصة للمشروع

```bash
# تشغيل التطوير
pnpm run dev

# بناء الإنتاج
pnpm run build

# معاينة البناء
pnpm run preview

# مزامنة Capacitor
pnpm run sync:android

# فتح Android Studio
pnpm run open:android

# تشغيل على Android
pnpm run run:android
```

---

## 🐛 حل المشاكل الشائعة

### 1. خطأ "pnpm: command not found"

```bash
# تثبيت pnpm عالمياً
npm install -g pnpm

# أو باستخدام npm
npm install -g @pnpm/exe
```

### 2. خطأ "lockfile is out of date"

```bash
# تحديث lockfile
pnpm install --no-frozen-lockfile

# أو حذف والإعادة
rm pnpm-lock.yaml
pnpm install
```

### 3. خطأ "peer dependencies"

```bash
# في ملف .npmrc، تأكد من:
strict-peer-dependencies=false
auto-install-peers=true
```

### 4. مشاكل Capacitor

```bash
# إعادة بناء كاملة
rm -rf node_modules android/node_modules
pnpm install
pnpm run build
pnpm exec cap sync android
```

### 5. خطأ "ENOENT: no such file or directory"

```bash
# التأكد من المسار الصحيح
pwd

# إعادة استنساخ المشروع
cd ..
git clone <repo-url>
cd <project-name>
pnpm install
```

### 6. مشاكل Google Maps

```bash
# تحقق من:
# 1. API Key صحيح
# 2. APIs مفعّلة في Google Cloud
# 3. Billing مُفعّل
# 4. Edge Function تعمل:
curl https://zrrffsjbfkphridqyais.supabase.co/functions/v1/get-maps-key
```

---

## ✅ قائمة التحقق النهائية

قبل البدء في التطوير:

- [ ] Node.js 18+ مُثبّت
- [ ] pnpm مُثبّت عالمياً
- [ ] Git مُثبّت ومُهيأ
- [ ] المشروع مستنسخ محلياً
- [ ] pnpm install تم بنجاح
- [ ] .env مُعد بشكل صحيح
- [ ] Supabase متصل
- [ ] Edge Functions منشورة
- [ ] Google Maps API تعمل
- [ ] dev server يعمل على http://localhost:8080
- [ ] يمكن تسجيل الدخول/إنشاء حساب

قبل النشر للإنتاج:

- [ ] جميع الاختبارات تمر بنجاح
- [ ] لا توجد console errors
- [ ] RLS Policies مفعّلة ومختبرة
- [ ] Environment Variables مُعدّة في منصة النشر
- [ ] server config محذوف من capacitor.config.ts (للـ Android)
- [ ] AAB موقّع بـ release keystore
- [ ] Screenshots و Store Listing جاهزة (للـ Play Store)
- [ ] سياسة الخصوصية منشورة
- [ ] Domain مُعد و SSL نشط (للـ Web)

---

## 📚 موارد إضافية

### التوثيق الرسمي

- [pnpm Docs](https://pnpm.io/)
- [Capacitor Docs](https://capacitorjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)

### أدلة المشروع

- [دليل النشر](./DEPLOYMENT.md)
- [دليل Google Play](./GOOGLE_PLAY_DEPLOYMENT.md)
- [دليل الاختبار المحلي](./LOCAL_TESTING.md)
- [معمارية النظام](./ARCHITECTURE.md)
- [دليل المكونات](./COMPONENTS_GUIDE.md)

### الدعم

- **GitHub Issues**: للإبلاغ عن مشاكل
- **البريد**: support@alazab.com
- **الموقع**: https://alazab.dev

---

## 🔄 تحديث المشروع

### سحب آخر التحديثات من GitHub

```bash
# سحب التغييرات
git pull origin main

# تحديث التبعيات
pnpm install

# مزامنة Capacitor
pnpm exec cap sync android

# إعادة البناء
pnpm run build
```

### ترقية التبعيات

```bash
# التحقق من التحديثات المتاحة
pnpm outdated

# تحديث بشكل تفاعلي
pnpm update -i

# أو تحديث الكل
pnpm update --latest
```

---

**تم التجهيز بنجاح! 🎉**

الآن يمكنك البدء في التطوير باستخدام:

```bash
pnpm run dev
```

للمساعدة أو الاستفسارات، راجع التوثيق أو تواصل مع الدعم.
