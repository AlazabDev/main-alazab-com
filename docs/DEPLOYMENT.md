# 📦 دليل نشر نظام إدارة الصيانة

دليل شامل لنشر التطبيق على مختلف المنصات.

## 🎯 جدول المحتويات

1. [النشر على Vercel](#vercel)
2. [النشر على Netlify](#netlify)
3. [النشر على خادم خاص (VPS)](#vps)
4. [النشر على Docker](#docker)
5. [إعداد Supabase Production](#supabase)
6. [إعداد Domain مخصص](#domain)
7. [SSL Certificate](#ssl)

---

## 🚀 Vercel (موصى به)

### الخطوات

1. **Push المشروع إلى GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/azab-services.git
git push -u origin main
```

2. **ربط مع Vercel**
- اذهب إلى [vercel.com](https://vercel.com)
- اضغط "Import Project"
- اختر الريبو من GitHub
- Vercel سيكتشف إعدادات Vite تلقائياً

3. **إضافة Environment Variables**
في Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Deploy**
اضغط "Deploy" وانتظر حتى ينتهي البناء.

### الإعدادات المتقدمة

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🌐 Netlify

### الخطوات

1. **Push إلى GitHub** (نفس الخطوة السابقة)

2. **ربط مع Netlify**
- اذهب إلى [netlify.com](https://netlify.com)
- اضغط "Add new site" → "Import an existing project"
- اختر الريبو

3. **إعدادات البناء**
```
Build command: npm run build
Publish directory: dist
```

4. **Environment Variables**
في Netlify Dashboard → Site settings → Environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

## 🖥️ خادم خاص (VPS)

### المتطلبات
- Ubuntu 20.04+ أو CentOS 8+
- Nginx
- SSL Certificate (Let's Encrypt)
- Node.js 18+

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت Certbot (لـ SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. بناء التطبيق

```bash
# على جهازك المحلي
npm run build

# نسخ الملفات إلى الخادم
scp -r dist/* user@your-server-ip:/var/www/azab-services/
```

### 3. إعداد Nginx

```nginx
# /etc/nginx/sites-available/azab-services
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/azab-services;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Assets caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Prevent access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/azab-services /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. إعداد SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot سيُعدّل ملف Nginx تلقائياً ويضيف HTTPS.

### 5. التجديد التلقائي للـ SSL

```bash
# اختبار التجديد
sudo certbot renew --dry-run

# Cron job للتجديد التلقائي (يتم إعداده تلقائياً)
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf للـ Docker

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### بناء وتشغيل

```bash
# بناء الصورة
docker build -t azab-services .

# تشغيل Container
docker run -d -p 80:80 --name azab-app azab-services

# أو باستخدام Docker Compose
docker-compose up -d
```

---

## 📊 Supabase Production

### 1. إنشاء مشروع Production

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد للإنتاج
3. اختر Region قريب من المستخدمين

### 2. Migration من Development إلى Production

```bash
# تصدير Schema من Development
supabase db dump -f schema.sql

# استيراد إلى Production
psql -h db.xxxxx.supabase.co -U postgres -d postgres -f schema.sql
```

### 3. إعداد Secrets للـ Edge Functions

في Supabase Dashboard → Edge Functions → Secrets:
```
GOOGLE_MAPS_API_KEY=your_key
OPENAI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
```

### 4. نشر Edge Functions

```bash
# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref your-production-ref

# نشر جميع Functions
supabase functions deploy

# أو نشر function معينة
supabase functions deploy send-notification
```

### 5. إعداد Database Backups

في Supabase Dashboard → Database → Backups:
- فعّل automatic daily backups
- حدّد retention period (7 أيام على الأقل)

---

## 🌍 Domain مخصص

### 1. شراء Domain

اشترِ domain من:
- Namecheap
- GoDaddy
- Google Domains

### 2. إعداد DNS

أضف السجلات التالية في DNS Provider:

#### لـ Vercel
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

#### لـ Netlify
```
A Record: @ → (Netlify IP)
CNAME: www → your-site.netlify.app
```

#### لـ VPS
```
A Record: @ → your-server-ip
A Record: www → your-server-ip
```

### 3. انتظر انتشار DNS (حتى 48 ساعة)

تحقق من الانتشار:
```bash
dig yourdomain.com
```

---

## 🔒 SSL Certificate

### Vercel & Netlify
SSL تلقائي ومجاني من Let's Encrypt.

### VPS مع Let's Encrypt

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# التجديد التلقائي
sudo certbot renew --dry-run
```

### Cloudflare SSL (موصى به)

1. أضف موقعك إلى Cloudflare
2. غيّر Nameservers إلى Cloudflare
3. فعّل SSL/TLS → Full (strict)
4. فعّل Always Use HTTPS
5. فعّل Automatic HTTPS Rewrites

---

## ✅ قائمة الفحص النهائية

قبل النشر للإنتاج:

- [ ] جميع Environment Variables مُعدّة
- [ ] Supabase RLS Policies مفعّلة ومختبرة
- [ ] Edge Functions منشورة ومختبرة
- [ ] SSL Certificate مُثبّت
- [ ] Google Maps API Key مُعدّ ومقيّد
- [ ] Backups مفعّلة
- [ ] Domain مربوط
- [ ] اختبار شامل لجميع المميزات
- [ ] Performance testing (Lighthouse score > 90)
- [ ] Security scan (لا أخطاء حرجة)

---

## 🔄 التحديثات المستقبلية

### Git Workflow

```bash
# تطوير ميزة جديدة
git checkout -b feature/new-feature
# ... عمل التغييرات
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Merge إلى main بعد المراجعة
git checkout main
git merge feature/new-feature
git push origin main
```

### Auto-deployment
Vercel و Netlify يقومون بـ auto-deploy عند push إلى main.

للـ VPS، أعدّ GitHub Actions:
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_KEY }}
          source: "dist/*"
          target: "/var/www/azab-services/"
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
- راجع [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- افتح issue على GitHub
- تواصل مع admin@alazab.online
