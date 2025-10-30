# إصلاحات الأمان المطلوبة

## 1. إزالة .env من التاريخ

```bash
# استخدام git filter-repo (الطريقة الموصى بها)
git filter-repo --path .env --invert-paths --force

# أو استخدام BFG (بديل أسرع)
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# دفع التغييرات
git push origin --force --all
```

## 2. تدوير المفاتيح

**مطلوب فورًا**:
- إنشاء مفاتيح Supabase جديدة من لوحة التحكم
- تحديث المتغيرات في Supabase Edge Functions Secrets
- حذف المفاتيح القديمة المكشوفة

## 3. RLS للجداول الحساسة

```sql
-- تفعيل RLS على جدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسة: المستخدم يرى ملفه فقط
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- سياسة: المستخدم يعدل ملفه فقط
CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- تفعيل RLS على user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- سياسة: المستخدم يرى دوره فقط
CREATE POLICY "Users view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- سياسة: فقط المديرون يضيفون أدوار
CREATE POLICY "Admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

## 4. توحيد مدير الحزم

```bash
# حذف ملفات lock المتضاربة
rm -f package-lock.json bun.lockb

# تفعيل corepack وتثبيت pnpm
corepack enable
corepack prepare pnpm@latest --activate

# تثبيت التبعيات
pnpm install --frozen-lockfile
```

## 5. أوامر التحقق

```bash
# تنظيف
rm -f package-lock.json bun.lockb

# تثبيت
corepack enable && corepack prepare pnpm@latest --activate
pnpm install --frozen-lockfile

# فحص
pnpm run lint          # متوقع: 0 errors
pnpm run typecheck     # متوقع: 0 errors
pnpm run build         # متوقع: dist/ created

# بناء Docker
docker build -t azab:prod .
docker run --rm -p 8080:80 azab:prod
# متوقع: http://localhost:8080 يعمل + /healthz.html returns OK
```

## 6. التحقق من الأمان

```bash
# تأكد من عدم وجود .env في التتبع
git ls-files | grep -E '\.env$'
# متوقع: لا نتائج

# تأكد من عدم وجود service_role في الكود
grep -r "service_role" src/
# متوقع: لا نتائج
```
