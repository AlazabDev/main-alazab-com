# إعداد Google Maps API Key

## 🚨 المشكلة الحالية

```
Google Maps JavaScript API error: RefererNotAllowedMapError
Your site URL to be authorized: https://c6adaf51-0eef-43e8-bf45-d65ac7ebe1aa.lovableproject.com/map
```

**السبب:** النطاق `*.lovableproject.com` غير مضاف إلى قائمة النطاقات المسموحة في Google Maps API Key.

---

## ✅ الحل - إضافة النطاقات المطلوبة

### الخطوة 1: الذهاب إلى Google Cloud Console

1. افتح [Google Cloud Console](https://console.cloud.google.com/)
2. اختر المشروع المرتبط بالمفتاح `AIzaSyBojIb88fGshq8NBXq2qNu-7eEJZwVgGxg`

### الخطوة 2: تعديل إعدادات API Key

1. انتقل إلى **APIs & Services** > **Credentials**
2. اختر API Key الخاص بك
3. في قسم **Application restrictions**، اختر **HTTP referrers (web sites)**

### الخطوة 3: إضافة النطاقات

أضف النطاقات التالية إلى قائمة **Website restrictions**:

```
*.lovable.app/*
*.lovableproject.com/*
https://*.alazab.com/*
https://*.alazab.dev/*
https://www.alazab.online/*
```

**ملاحظة:** 
- استخدم `*` للـ wildcard (جميع الـ subdomains)
- أضف `/*` في النهاية لجميع المسارات

### الخطوة 4: حفظ التغييرات

اضغط على **Save** وانتظر بضع دقائق حتى تسري التغييرات.

---

## 🔧 الإعدادات الموصى بها

### 1. **Application restrictions**
```
HTTP referrers (web sites)
```

### 2. **Website restrictions**
```
*.lovable.app/*
*.lovableproject.com/*
https://*.alazab.com/*
https://*.alazab.dev/*
https://www.alazab.online/*
```

### 3. **API restrictions**
قيّد الاستخدام على:
- Maps JavaScript API ✅
- Maps SDK for Android (إذا كنت تستخدم تطبيق Android) ✅
- Geocoding API (اختياري) ⚠️
- Places API (اختياري) ⚠️

---

## 🛡️ الأمان

### ✅ ما تم تطبيقه حالياً:
- المفتاح محمي بـ HTTP referrers
- مقيّد على نطاقات محددة
- يعمل في بيئات التطوير والإنتاج

### ⚠️ تحذيرات:
- **لا تستخدم المفتاح في تطبيقات Native** (Android/iOS) - استخدم API Key منفصل
- **لا تشارك المفتاح علناً** على GitHub أو أماكن عامة
- **راجع الاستخدام شهرياً** في Google Cloud Console

---

## 📊 مراقبة الاستخدام

### تحقق من الاستخدام:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Enabled APIs & services**
3. اختر **Maps JavaScript API**
4. راجع **Metrics** و **Quotas**

### تنبيهات الحصة:
1. اذهب إلى **APIs & Services** > **Quotas**
2. اضبط **Quota alerts** عند 80% من الحصة المجانية
3. أضف بريدك الإلكتروني للتنبيهات

---

## 🎯 الحصة المجانية

Google Maps تمنحك:
- **$200 شهرياً** مجاناً
- ما يعادل حوالي **28,500 عملية تحميل خريطة** شهرياً
- **100,000 طلب Geocoding** شهرياً

**نصيحة:** استخدم Lazy Loading للخرائط لتوفير الحصة:
```typescript
// في GoogleMap.tsx
const [shouldLoadMap, setShouldLoadMap] = useState(false);

useEffect(() => {
  // تحميل الخريطة فقط عند الحاجة
  const timer = setTimeout(() => setShouldLoadMap(true), 1000);
  return () => clearTimeout(timer);
}, []);
```

---

## 🔄 التحديثات المطبقة

### 1. ✅ تم استبدال `google.maps.Marker` بـ `AdvancedMarkerElement`

**قبل:**
```typescript
const mapMarker = new google.maps.Marker({
  position: { lat: marker.lat, lng: marker.lng },
  map: mapInstance,
});
```

**بعد:**
```typescript
const mapMarker = new google.maps.marker.AdvancedMarkerElement({
  position: { lat: marker.lat, lng: marker.lng },
  map: mapInstance,
});
```

**الفائدة:** 
- تجنب تحذيرات Deprecation
- أداء أفضل
- ميزات أحدث

### 2. ✅ إصلاح خطأ `statusConfig` في RecentRequests

**المشكلة:**
```typescript
statusConfig[request.status]?.className // undefined error
```

**الحل:**
```typescript
statusConfig[request.status as keyof typeof statusConfig]?.className || "bg-muted"
```

**الفائدة:**
- لا مزيد من الأخطاء عند statuses غير متوقعة
- fallback آمن

---

## 📞 الدعم

إذا استمرت المشكلة:

1. تحقق من DNS propagation: [DNSChecker.org](https://dnschecker.org)
2. امسح الـ cache: `Ctrl+Shift+Delete`
3. انتظر 5-10 دقائق بعد التغييرات
4. تحقق من Console للأخطاء الجديدة

---

**آخر تحديث:** 29 أكتوبر 2025  
**النطاقات المطلوبة:** `*.lovableproject.com/*` و `*.lovable.app/*`
