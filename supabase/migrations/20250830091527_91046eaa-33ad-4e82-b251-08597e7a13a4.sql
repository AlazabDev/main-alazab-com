-- إنشاء مستخدم تجريبي جديد بكلمة مرور معروفة
-- سنستخدم دالة auth.create_user() لإنشاء مستخدم مباشرة

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@alazab.online',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "مستخدم تجريبي"}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('123456', gen_salt('bf')),
  updated_at = now();