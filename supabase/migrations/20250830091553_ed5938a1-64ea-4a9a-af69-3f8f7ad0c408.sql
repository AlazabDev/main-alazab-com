-- إعادة تعيين كلمة مرور للمستخدم الحالي
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf')),
    updated_at = now()
WHERE email = 'admin@alazab.online';