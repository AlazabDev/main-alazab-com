-- تحسين الأداء - إضافة فهارس للبحث السريع
-- فهارس للبحث الجغرافي والاستعلامات الشائعة

-- فهرس للبحث الجغرافي في vendor_locations
CREATE INDEX IF NOT EXISTS idx_vendor_locations_coords 
ON vendor_locations (latitude, longitude) 
WHERE is_active = true;

-- فهرس للبحث في maintenance_requests بالحالة والتاريخ
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status_date 
ON maintenance_requests (status, created_at DESC);

-- فهرس للبحث بالموقع في maintenance_requests
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_location 
ON maintenance_requests (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- فهرس للبحث في service_requests بالحالة والفرع
CREATE INDEX IF NOT EXISTS idx_service_requests_status_branch 
ON service_requests (status, branch_id, created_at DESC);

-- فهرس للبحث في التعليقات
CREATE INDEX IF NOT EXISTS idx_comments_entity 
ON comments (entity_type, entity_id, created_at DESC);

-- فهرس للبحث في الإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read 
ON notifications (recipient_id, read_at, created_at DESC);

-- فهرس للبحث في المواعيد
CREATE INDEX IF NOT EXISTS idx_appointments_date_status 
ON appointments (appointment_date, status, created_at DESC);

-- فهرس للبحث السريع في الخدمات
CREATE INDEX IF NOT EXISTS idx_services_search 
ON services USING gin(search_keywords);

-- فهرس للبحث في الفنيين حسب التخصص
CREATE INDEX IF NOT EXISTS idx_vendors_specialization 
ON vendors USING gin(specialization) 
WHERE status = 'active';

-- إحصائيات للجداول المهمة (لتحسين خطط الاستعلام)
ANALYZE maintenance_requests;
ANALYZE service_requests;
ANALYZE vendors;
ANALYZE vendor_locations;
ANALYZE notifications;