-- إنشاء مستخدم إداري في قاعدة البيانات مباشرة
-- أولاً سنقوم بإدراج المستخدم في جدول auth.users مباشرة

-- إنشاء ملف تعريف المدير
INSERT INTO profiles (
  user_id,
  first_name,
  last_name,
  phone,
  role
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'محمد',
  'عزب',
  '01234567890',
  'admin'
) ON CONFLICT (user_id) DO NOTHING;