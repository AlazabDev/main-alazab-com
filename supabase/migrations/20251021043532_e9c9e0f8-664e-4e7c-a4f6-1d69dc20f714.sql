-- حذف جدول notes القديم (يحتوي على 3 سجلات فقط ولا يستخدم في الكود)
DROP TABLE IF EXISTS notes CASCADE;

-- حذف جدول kv_store القديم (تخزين مؤقت غير مستخدم)
DROP TABLE IF EXISTS kv_store_4e5b82c2 CASCADE;