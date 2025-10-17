# 📱 دليل نشر التطبيق على Google Play Store

دليل شامل لنشر تطبيق Azab Maintenance على متجر Google Play.

## 🎯 جدول المحتويات

1. [المتطلبات الأساسية](#requirements)
2. [إعداد المشروع](#setup)
3. [بناء التطبيق](#build)
4. [إنشاء حساب Google Play](#account)
5. [إعداد التطبيق في Console](#console)
6. [توقيع التطبيق](#signing)
7. [رفع التطبيق](#upload)
8. [اختبار التطبيق](#testing)
9. [النشر النهائي](#publish)

---

## 📋 المتطلبات الأساسية {#requirements}

### الأدوات المطلوبة
- **Android Studio** (آخر إصدار)
- **JDK 11** أو أعلى
- **Node.js 18+** و npm
- **Capacitor CLI**: `npm install -g @capacitor/cli`
- **حساب Google Play Console** ($25 رسوم تسجيل لمرة واحدة)

### المستندات المطلوبة
- سياسة الخصوصية (Privacy Policy) منشورة على رابط عام
- صور للتطبيق (Screenshots)
- أيقونة التطبيق (App Icon) 512x512px
- Feature Graphic 1024x500px
- وصف التطبيق بالعربية والإنجليزية

---

## ⚙️ إعداد المشروع {#setup}

### 1. استنساخ المشروع من GitHub

```bash
# استنساخ المشروع
git clone https://github.com/your-username/azab-maintenance.git
cd azab-maintenance

# تثبيت Dependencies
npm install
```

### 2. إضافة منصة Android

```bash
# إضافة منصة Android
npx cap add android

# تحديث المنصة
npx cap update android
```

### 3. إعداد Environment Variables

أنشئ ملف `.env.production` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. تعديل capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alazab.maintenance',
  appName: 'Azab Maintenance',
  webDir: 'dist',
  // احذف server config للنشر
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#f5bf23",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
```

---

## 🏗️ بناء التطبيق {#build}

### 1. بناء الواجهة

```bash
# بناء النسخة Production
npm run build

# نسخ الملفات إلى Android
npx cap sync android
```

### 2. فتح المشروع في Android Studio

```bash
npx cap open android
```

### 3. تحديث build.gradle

في ملف `android/app/build.gradle`:

```gradle
android {
    namespace "com.alazab.maintenance"
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.alazab.maintenance"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }
}
```

### 4. تحديث AndroidManifest.xml

تأكد من الأذونات الضرورية في `android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.alazab.maintenance">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:exported="true"
            android:launchMode="singleTask"
            android:name="com.getcapacitor.BridgeActivity"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

    <!-- الأذونات الأساسية -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- للنسخ الأحدث من Android -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    
    <!-- للنسخ القديمة من Android -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="28" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />
</manifest>
```

---

## 🔐 توقيع التطبيق {#signing}

### 1. إنشاء Keystore

```bash
# في مجلد android/app
keytool -genkey -v -keystore azab-release.keystore -alias azab-key -keyalg RSA -keysize 2048 -validity 10000

# ستُسأل عن:
# - كلمة مرور keystore (احفظها بأمان!)
# - اسمك وتفاصيل المنظمة
# - كلمة مرور alias (يفضل نفس كلمة مرور keystore)
```

⚠️ **مهم جداً**: احفظ ملف `azab-release.keystore` وكلمات المرور في مكان آمن! إذا فقدتهم لن تستطيع تحديث التطبيق.

### 2. إعداد ملف key.properties

أنشئ ملف `android/key.properties`:

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=azab-key
storeFile=azab-release.keystore
```

⚠️ **أضف `android/key.properties` إلى `.gitignore`**

### 3. تحديث build.gradle لاستخدام Keystore

في `android/app/build.gradle`:

```gradle
// في أول الملف
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... باقي الإعدادات
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. بناء APK/AAB موقّع

```bash
# في Android Studio:
# Build → Generate Signed Bundle / APK
# اختر Android App Bundle (AAB) للنشر على Google Play

# أو من Terminal:
cd android
./gradlew bundleRelease

# سيتم إنشاء الملف في:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🏪 إنشاء حساب Google Play {#account}

### 1. إنشاء حساب Google Play Console

1. اذهب إلى [Google Play Console](https://play.google.com/console)
2. ادفع رسوم التسجيل ($25 لمرة واحدة)
3. أكمل معلومات المطور

### 2. إنشاء تطبيق جديد

1. اضغط **Create app**
2. املأ المعلومات:
   - **App name**: Azab Maintenance
   - **Default language**: Arabic (العربية)
   - **App or game**: App
   - **Free or paid**: Free
3. وافق على السياسات واضغط **Create app**

---

## 🎨 إعداد التطبيق في Console {#console}

### 1. App content (محتوى التطبيق)

#### Privacy policy
- رابط سياسة الخصوصية (مطلوب)
- يجب أن يكون رابط عام يعمل

#### App access
- اختر "All functionality is available without restrictions" إذا لم يكن هناك قيود
- أو أضف حساب تجريبي للمراجعين

#### Ads
- هل التطبيق يحتوي على إعلانات؟ (لا)

#### Target audience
- الفئة العمرية: 18+
- هل للأطفال؟: لا

#### News apps
- هل تطبيق أخبار؟: لا

### 2. Store listing (قائمة المتجر)

#### App details
```
App name: Azab Maintenance - إدارة الصيانة
Short description (80 حرف):
نظام إدارة الصيانة الذكي لإدارة طلبات الصيانة والعقارات بكفاءة عالية

Full description (4000 حرف):
نظام Azab Maintenance هو حل شامل لإدارة الصيانة مصمم خصيصاً لتبسيط عمليات الصيانة والإصلاح.

المميزات الرئيسية:
✅ إدارة طلبات الصيانة بسهولة
✅ تتبع حالة الطلبات في الوقت الفعلي
✅ إدارة العقارات والممتلكات
✅ نظام إشعارات فوري
✅ تقارير وإحصائيات مفصلة
✅ خرائط تفاعلية لتحديد المواقع
✅ معرض صور احترافي
✅ نظام فواتير متكامل
✅ دعم متعدد اللغات (عربي/إنجليزي)

مناسب لـ:
• شركات الصيانة
• مكاتب إدارة العقارات
• مقاولي الإصلاح
• أصحاب العقارات

مع Azab Maintenance، يمكنك:
• إنشاء طلبات صيانة بنقرة واحدة
• تعيين الفنيين للمهام
• متابعة تقدم العمل
• إرسال فواتير للعملاء
• تحليل الأداء بتقارير ذكية

التطبيق مجاني ومفتوح المصدر!
```

#### Graphics

**App icon** (512x512px)
- أيقونة عالية الجودة بدون شفافية
- PNG أو JPEG

**Feature graphic** (1024x500px)
- صورة عرض رئيسية
- تُعرض في صفحة التطبيق

**Screenshots** (على الأقل 2، حتى 8)
- **Phone**: 320px - 3840px (جانب قصير)
- **7-inch tablet**: 1024 x 600px minimum
- **10-inch tablet**: 1080 x 1920px minimum

التقط screenshots من التطبيق:
1. الشاشة الرئيسية (Dashboard)
2. قائمة طلبات الصيانة
3. إنشاء طلب جديد
4. تفاصيل الطلب
5. الخريطة
6. التقارير
7. صفحة الإعدادات
8. المعرض

#### Categorization
- **App category**: Productivity
- **Tags**: maintenance, property management, facilities

#### Contact details
- Email: support@alazab.com (أو بريدك)
- Website: https://your-domain.com (اختياري)
- Phone: +20xxxxxxxxx (اختياري)

### 3. Countries and regions
اختر الدول التي تريد نشر التطبيق فيها:
- Egypt (مصر)
- Saudi Arabia (السعودية)
- UAE (الإمارات)
- أو جميع الدول

---

## 📤 رفع التطبيق {#upload}

### 1. Production track

1. اذهب إلى **Production** → **Create new release**
2. ارفع ملف `app-release.aab`
3. أضف **Release notes** بالعربية والإنجليزية:

```
النسخة 1.0.0 (2025)
الإصدار الأول من التطبيق

المميزات:
✅ إدارة طلبات الصيانة
✅ تتبع العقارات
✅ نظام الإشعارات
✅ التقارير والإحصائيات
✅ خرائط تفاعلية
✅ معرض صور احترافي
✅ دعم اللغة العربية والإنجليزية
```

4. اضغط **Save** ثم **Review release**

### 2. Testing tracks (اختياري لكن موصى به)

قبل النشر للجميع، يمكنك اختبار التطبيق:

#### Internal testing
- حتى 100 مختبر
- نشر فوري بدون مراجعة

#### Closed testing (Alpha/Beta)
- عدد غير محدود من المختبرين
- يحتاج مراجعة خفيفة

#### Open testing
- متاح للجميع للتجربة
- يحتاج مراجعة كاملة

```bash
# رفع نسخة اختبار
# في Google Play Console:
# Testing → Internal testing → Create new release
# ارفع AAB واختبر مع فريقك أولاً
```

---

## 🧪 اختبار التطبيق {#testing}

### Pre-launch report

Google Play يقوم بفحص تلقائي للتطبيق على أجهزة مختلفة:
- اختبار الثبات (Stability)
- اختبار الأداء (Performance)
- اختبار الأمان (Security)
- اختبار الوصول (Accessibility)

راجع التقرير وأصلح أي مشاكل.

### Internal testing checklist

- [ ] تسجيل دخول/إنشاء حساب يعمل
- [ ] إنشاء طلب صيانة
- [ ] رفع صور
- [ ] استخدام الخرائط
- [ ] الإشعارات تعمل
- [ ] التقارير تظهر بشكل صحيح
- [ ] التطبيق يعمل على Android 8+ (API 26+)
- [ ] لا توجد أخطاء في Console
- [ ] الأذونات تعمل (Camera, Location)
- [ ] التطبيق يعمل بدون إنترنت (بشكل محدود)
- [ ] الأداء سلس (لا تأخير أو lag)

---

## 🚀 النشر النهائي {#publish}

### 1. مراجعة نهائية

تأكد من:
- [ ] جميع معلومات Store listing مكتملة
- [ ] Screenshots واضحة وجذابة
- [ ] سياسة الخصوصية متوفرة
- [ ] AAB موقّع بشكل صحيح
- [ ] النسخة التجريبية تم اختبارها
- [ ] لا توجد أخطاء في Pre-launch report
- [ ] App content questionnaire مكتمل

### 2. إرسال للمراجعة

1. اذهب إلى **Publishing overview**
2. تأكد من أن جميع البنود خضراء ✅
3. اضغط **Send for review**

### 3. وقت المراجعة

- عادةً 1-3 أيام
- قد يطلبون تعديلات
- ستصلك إشعارات على البريد

### 4. بعد الموافقة

- التطبيق سيصبح متاح خلال ساعات
- شارك رابط التطبيق:
  `https://play.google.com/store/apps/details?id=com.alazab.maintenance`

---

## 🔄 التحديثات المستقبلية

### زيادة versionCode و versionName

في `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2  // زد واحد مع كل تحديث
    versionName "1.1.0"  // غيّر حسب نوع التحديث
}
```

### Semantic Versioning
- **1.0.0** → **1.0.1**: Bug fixes (Patch)
- **1.0.0** → **1.1.0**: مميزات جديدة (Minor)
- **1.0.0** → **2.0.0**: تغييرات كبيرة (Major)

### رفع تحديث

```bash
# بناء نسخة جديدة
npm run build
npx cap sync android

# في Android Studio
./gradlew bundleRelease

# في Google Play Console
# Production → Create new release
# ارفع AAB الجديد
# أضف Release notes بالتحديثات
```

---

## 📊 تتبع الأداء

### Google Play Console Analytics

راقب:
- عدد التنزيلات
- التقييمات والمراجعات
- معدل الإلغاء (Uninstall rate)
- الأعطال (Crashes)
- ANRs (App Not Responding)
- التفاعل (User engagement)

### Firebase Analytics (اختياري)

أضف Firebase للمتابعة التفصيلية:

```bash
npm install @capacitor-firebase/analytics
npx cap sync
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة: التطبيق لا يبنى

```bash
# نظف المشروع
cd android
./gradlew clean

# أعد البناء
./gradlew bundleRelease
```

### مشكلة: Keystore مفقود

⚠️ **إذا فقدت keystore الأصلي:**
- لا يمكنك تحديث التطبيق
- يجب إنشاء تطبيق جديد بـ package name مختلف
- **الحل**: احفظ نسخة احتياطية من keystore في مكان آمن!

### مشكلة: Permissions لا تعمل

تأكد من:
1. الأذونات موجودة في `AndroidManifest.xml`
2. طلب الأذونات في الكود عند الحاجة
3. المستخدم منح الأذونات

### مشكلة: رفض التطبيق من Google

أسباب شائعة:
- سياسة الخصوصية غير واضحة أو غير متوفرة
- أذونات غير مبررة
- محتوى مخالف
- مشاكل أمنية

**الحل**: اقرأ سبب الرفض بعناية وقم بالتعديلات المطلوبة

---

## 📚 موارد مفيدة

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Developer Guides](https://developer.android.com/guide)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [App Signing Best Practices](https://developer.android.com/studio/publish/app-signing)

---

## ✅ قائمة فحص كاملة

### قبل الرفع
- [ ] AAB موقّع ومبني بنجاح
- [ ] اختبار على جهاز حقيقي
- [ ] جميع المميزات تعمل
- [ ] لا توجد أخطاء في Console
- [ ] الأذونات تعمل بشكل صحيح
- [ ] الأداء ممتاز

### متطلبات Google Play
- [ ] حساب Google Play مفعّل
- [ ] سياسة الخصوصية منشورة
- [ ] App Icon 512x512
- [ ] Feature Graphic 1024x500
- [ ] Screenshots (2-8)
- [ ] وصف مكتوب بالعربية والإنجليزية
- [ ] App content questionnaire مكتمل
- [ ] اختيار الفئة المناسبة
- [ ] تحديد الدول المستهدفة

### بعد النشر
- [ ] مراقبة Reviews
- [ ] الرد على التعليقات
- [ ] متابعة Crash reports
- [ ] تخطيط للتحديثات
- [ ] تسويق التطبيق

---

## 🎉 مبروك!

بعد اتباع هذه الخطوات، تطبيقك الآن على Google Play Store! 🚀

**رابط التطبيق:**
```
https://play.google.com/store/apps/details?id=com.alazab.maintenance
```

شارك الرابط مع عملائك وابدأ في جمع التقييمات الإيجابية! ⭐⭐⭐⭐⭐
