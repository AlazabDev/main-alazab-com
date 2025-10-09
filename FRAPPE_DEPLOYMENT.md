# دليل نشر مشروع Azab Shop في بيئة Frappe

## نظرة عامة على البنية

المشروع يحتوي على جزئين رئيسيين:

### 1. الواجهة الأمامية (Frontend)
- **التقنية**: React + Vite + TypeScript
- **المسار**: `src/`
- **قاعدة البيانات**: Supabase
- **المصادقة**: Supabase Auth

### 2. التكامل مع Frappe (Backend Integration)
- **المسار**: `azab_shop/`
- **الغرض**: دمج التطبيق مع نظام Frappe ERP

---

## البنية الحالية

```
azab_shop/                          # جذر التطبيق Frappe
├── azab_shop/                      # الوحدة الرئيسية
│   └── __init__.py                 # معلومات الإصدار
├── config/                         # إعدادات التطبيق
│   ├── __init__.py
│   ├── desktop.py                  # أيقونات سطح المكتب
│   └── docs.py                     # إعدادات التوثيق
├── public/                         # الملفات العامة
│   ├── css/
│   │   └── azab_shop.css          # ستايلات مخصصة
│   └── js/
│       └── azab_dashboard.js      # سكريبتات مخصصة
├── templates/                      # قوالب HTML
│   ├── includes/                   # مكونات مشتركة
│   └── pages/                      # صفحات ويب
│       ├── azab_dashboard.html    # صفحة لوحة التحكم
│       └── azab_dashboard.py      # منطق الصفحة
├── www/                            # صفحات ويب عامة
├── hooks.py                        # هوكس Frappe
├── modules.txt                     # قائمة الوحدات
├── patches.txt                     # التحديثات
├── permissions.py                  # الصلاحيات
└── api.py                          # API endpoints
```

---

## خطوات النشر في بيئة Frappe

### المتطلبات الأساسية

1. **خادم Frappe/ERPNext**
   - Frappe Framework v14 أو أحدث
   - Python 3.10+
   - Node.js 18+
   - MariaDB/PostgreSQL

2. **Bench مثبت ومهيأ**
   ```bash
   bench --version
   ```

---

### الخطوة 1: تحضير المشروع

#### تحديث setup.py
تأكد من أن `setup.py` يشير إلى المسار الصحيح:

```python
from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

from azab_shop import __version__ as version

setup(
    name="azab_shop",
    version=version,
    description="نظام إدارة العقارات والصيانة",
    author="Alazab Solutions",
    author_email="alazab.architecture@outlook.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
```

#### إنشاء MANIFEST.in
```bash
include MANIFEST.in
include requirements.txt
include *.json
include *.md
include *.py
include *.txt
recursive-include azab_shop *.css
recursive-include azab_shop *.csv
recursive-include azab_shop *.html
recursive-include azab_shop *.ico
recursive-include azab_shop *.js
recursive-include azab_shop *.json
recursive-include azab_shop *.md
recursive-include azab_shop *.png
recursive-include azab_shop *.py
recursive-include azab_shop *.svg
recursive-include azab_shop *.txt
recursive-exclude azab_shop *.pyc
```

---

### الخطوة 2: بناء الواجهة الأمامية

#### الطريقة الأولى: باستخدام السكريبت الجاهز

```bash
# من جذر المشروع
chmod +x build_for_frappe.sh
./build_for_frappe.sh
```

#### الطريقة الثانية: يدوياً

```bash
# 1. بناء التطبيق
npm run build:frappe

# 2. نسخ الملفات إلى Frappe
mkdir -p azab_shop/public/dist
cp -r dist/* azab_shop/public/dist/
```

---

### الخطوة 3: إضافة التطبيق إلى Bench

#### السيناريو 1: من مجلد محلي

```bash
# الانتقال إلى مجلد bench
cd ~/frappe-bench

# إضافة التطبيق
bench get-app /path/to/azab_shop
```

#### السيناريو 2: من Git Repository

```bash
# إذا كان المشروع على GitHub
bench get-app https://github.com/your-username/azab_shop.git

# للتطوير (مع رابط symbolic)
bench get-app /path/to/azab_shop --resolve-deps
```

---

### الخطوة 4: تثبيت التطبيق على الموقع

```bash
# تثبيت على موقع محدد
bench --site your-site.local install-app azab_shop

# أو على جميع المواقع
bench install-app azab_shop
```

---

### الخطوة 5: إعداد قاعدة البيانات والصلاحيات

#### تشغيل الميغريشنز (إذا كانت موجودة)

```bash
bench --site your-site.local migrate
```

#### إعداد الصلاحيات

```bash
bench --site your-site.local set-admin-password [new-password]
```

---

### الخطوة 6: إعدادات Nginx (للإنتاج)

#### تحديث إعدادات Nginx

```bash
# إنشاء/تحديث ملف nginx
bench setup nginx

# إعادة تشغيل nginx
sudo systemctl reload nginx
```

#### ملف nginx مخصص (اختياري)

```nginx
# /etc/nginx/conf.d/azab_shop.conf
location /azab-dashboard {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

### الخطوة 7: إعداد SSL (للإنتاج)

```bash
# باستخدام Let's Encrypt
bench setup lets-encrypt your-site.local

# أو يدوياً
sudo certbot --nginx -d your-site.local
```

---

### الخطوة 8: تشغيل التطبيق

#### للتطوير

```bash
# تشغيل خادم التطوير
bench start
```

#### للإنتاج

```bash
# إعداد supervisor
bench setup supervisor
sudo systemctl restart supervisor

# التحقق من الحالة
sudo supervisorctl status all
```

---

## التكامل مع Supabase

### إعداد متغيرات البيئة

أنشئ ملف `site_config.json` في مجلد الموقع:

```json
{
  "supabase_url": "https://zrrffsjbfkphridqyais.supabase.co",
  "supabase_anon_key": "your-anon-key",
  "supabase_service_key": "your-service-key"
}
```

### استخدام Supabase من Python

في `azab_shop/api.py`:

```python
import frappe
from supabase import create_client

@frappe.whitelist()
def get_supabase_data():
    """Get data from Supabase"""
    url = frappe.conf.get("supabase_url")
    key = frappe.conf.get("supabase_anon_key")
    
    supabase = create_client(url, key)
    
    # مثال: جلب البيانات
    response = supabase.table('properties').select("*").execute()
    return response.data
```

---

## صفحات الويب

### الوصول إلى لوحة التحكم

بعد التثبيت، يمكن الوصول إلى التطبيق عبر:

```
http://your-site.local/azab-dashboard
```

### إنشاء صفحات جديدة

1. **أنشئ ملف HTML** في `azab_shop/templates/pages/`
2. **أنشئ ملف Python** بنفس الاسم
3. **أضف المسار** في `azab_shop/www/`

مثال:

```python
# azab_shop/templates/pages/my_page.py
import frappe

def get_context(context):
    context.title = "صفحتي المخصصة"
    context.data = frappe.db.get_list("Property")
    return context
```

```html
<!-- azab_shop/templates/pages/my_page.html -->
{% extends "templates/web.html" %}

{% block title %}{{ title }}{% endblock %}

{% block content %}
<div class="container">
    <h1>{{ title }}</h1>
    <!-- محتوى الصفحة -->
</div>
{% endblock %}
```

---

## الأوامر المفيدة

### إدارة التطبيق

```bash
# تحديث التطبيق
bench update --app azab_shop

# إعادة بناء الأصول
bench build --app azab_shop

# مسح الكاش
bench --site your-site.local clear-cache
bench --site your-site.local clear-website-cache

# إعادة تشغيل
bench restart

# عرض السجلات
bench --site your-site.local console
tail -f sites/your-site.local/logs/web.log
```

### استكشاف الأخطاء

```bash
# تفعيل وضع التطوير
bench --site your-site.local set-config developer_mode 1

# تشغيل مع التتبع
bench --verbose start

# فحص الأخطاء
bench doctor
```

---

## البنية المقترحة للنشر

### خيار 1: نشر منفصل (الموصى به)

```
┌─────────────────┐         ┌─────────────────┐
│  React Frontend │◄────────┤   Supabase      │
│  (Lovable.app)  │         │   (Database)    │
└────────┬────────┘         └─────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Frappe Backend │
│  (your-server)  │
└─────────────────┘
```

- **Frontend**: يبقى على Lovable أو Vercel
- **Backend**: Frappe على الخادم الخاص
- **Database**: Supabase
- **التواصل**: REST API

### خيار 2: نشر متكامل

```
┌──────────────────────────┐
│   Frappe Server          │
│  ┌──────────────────┐   │      ┌──────────────┐
│  │ React (Static)   │   │◄─────┤  Supabase    │
│  └──────────────────┘   │      └──────────────┘
│  ┌──────────────────┐   │
│  │ Frappe Backend   │   │
│  └──────────────────┘   │
└──────────────────────────┘
```

- **كل شيء**: على خادم Frappe واحد
- **Static Files**: في `azab_shop/public/dist/`
- **Backend**: Frappe APIs

---

## ملاحظات مهمة

### 1. الأمان

- **لا تنشر** مفاتيح Supabase في الكود
- استخدم `site_config.json` للإعدادات الحساسة
- فعّل HTTPS في الإنتاج

### 2. الأداء

- استخدم Redis للكاش
- فعّل ضغط Gzip
- استخدم CDN للأصول الثابتة

### 3. النسخ الاحتياطي

```bash
# نسخ احتياطي للموقع
bench --site your-site.local backup

# استعادة من نسخة احتياطية
bench --site your-site.local restore path/to/backup.sql
```

---

## الدعم والمساعدة

### الموارد

- **توثيق Frappe**: https://frappeframework.com/docs
- **مجتمع Frappe**: https://discuss.frappe.io
- **GitHub Issues**: للمشاكل الخاصة بالمشروع

### الحصول على المساعدة

1. تحقق من السجلات: `tail -f sites/*/logs/*.log`
2. راجع Frappe console: `bench --site your-site.local console`
3. استخدم `bench doctor` للتشخيص

---

## الخلاصة

المشروع الحالي مهيأ للعمل مع Supabase كقاعدة بيانات، وFrappe كنظام ERP. يمكنك:

1. **استخدام React فقط** مع Supabase (الوضع الحالي)
2. **دمج مع Frappe** للحصول على ميزات ERP إضافية
3. **نشر هجين** حيث Frontend منفصل و Backend على Frappe

اختر السيناريو المناسب لاحتياجاتك!
