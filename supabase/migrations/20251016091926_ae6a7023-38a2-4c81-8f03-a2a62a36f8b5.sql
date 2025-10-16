-- حذف جداول الملخصات القديمة غير الآمنة (المكررة)
-- نبقي فقط على الجداول الآمنة: appointments_summary_secure و maintenance_requests_summary_secure

DROP TABLE IF EXISTS public.appointments_summary;
DROP TABLE IF EXISTS public.maintenance_requests_summary;