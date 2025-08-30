-- إنشاء مستخدم تجريبي ونموذج أساسي للمشاريع
-- أولاً إضافة بعض البيانات الأساسية للاختبار

-- إدراج بعض طلبات الصيانة التجريبية
INSERT INTO maintenance_requests (
  title, 
  description, 
  client_name, 
  client_phone, 
  location, 
  service_type, 
  status, 
  priority,
  customer_notes,
  estimated_cost
) VALUES 
(
  'إصلاح تسريب في الحمام', 
  'يوجد تسريب مياه في حمام الدور الأول تحت المغسلة', 
  'أحمد محمد', 
  '01012345678', 
  'شارع الجمهورية، المنصورة', 
  'plumbing', 
  'pending', 
  'high',
  'الوضع عاجل جداً - المياه تنزل على الجيران',
  500.00
),
(
  'صيانة مكيف الهواء', 
  'المكيف لا يبرد بشكل جيد ويصدر أصوات غريبة', 
  'فاطمة علي', 
  '01098765432', 
  'شارع البحر، الإسكندرية', 
  'hvac', 
  'in_progress', 
  'medium',
  'المكيف في غرفة النوم الرئيسية',
  300.00
),
(
  'إصلاح باب المنزل', 
  'الباب الخارجي لا يغلق بشكل محكم', 
  'محمود حسن', 
  '01156789012', 
  'شارع النيل، القاهرة', 
  'carpentry', 
  'completed', 
  'low',
  'يحتاج تعديل في المفصلات',
  150.00
),
(
  'تركيب لمبات LED', 
  'تغيير إضاءة المنزل إلى LED لتوفير الطاقة', 
  'سارة أحمد', 
  '01023456789', 
  'شارع المعز، الجيزة', 
  'electrical', 
  'pending', 
  'medium',
  'المطلوب تركيب 8 لمبات في الصالة والغرف',
  400.00
);

-- إضافة بعض الموردين
INSERT INTO vendors (
  name, 
  company_name, 
  phone, 
  email, 
  specialization, 
  hourly_rate,
  experience_years,
  rating,
  status
) VALUES 
(
  'محمد الفني',
  'شركة الفني المحترف للسباكة',
  '01012345678',
  'mohamed.plumber@example.com',
  ARRAY['plumbing', 'general'],
  80.00,
  10,
  4.5,
  'active'
),
(
  'أحمد الكهربائي',
  'الكهربائي الماهر',
  '01098765432',
  'ahmed.electric@example.com',
  ARRAY['electrical'],
  60.00,
  7,
  4.2,
  'active'
),
(
  'علي النجار',
  'ورشة علي للنجارة',
  '01156789012',
  'ali.carpenter@example.com',
  ARRAY['carpentry'],
  70.00,
  12,
  4.8,
  'active'
);

-- إضافة بعض العقارات
INSERT INTO properties (
  name,
  type,
  address,
  status,
  area,
  value,
  rooms,
  bathrooms,
  floors
) VALUES 
(
  'شقة سكنية - المنصورة',
  'apartment',
  'شارع الجمهورية، المنصورة، الدقهلية',
  'active',
  120.00,
  850000.00,
  3,
  2,
  1
),
(
  'فيلا - الإسكندرية',
  'villa',
  'شارع البحر، الإسكندرية',
  'active',
  300.00,
  2500000.00,
  5,
  3,
  2
),
(
  'محل تجاري - القاهرة',
  'commercial',
  'شارع النيل، وسط القاهرة',
  'active',
  80.00,
  1200000.00,
  2,
  1,
  1
);

-- إضافة بعض المواعيد
INSERT INTO appointments (
  title,
  description,
  customer_name,
  customer_phone,
  appointment_date,
  appointment_time,
  status,
  duration_minutes,
  location
) VALUES 
(
  'موعد فحص التسريب',
  'فحص تسريب المياه في الحمام',
  'أحمد محمد',
  '01012345678',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00:00',
  'scheduled',
  60,
  'شارع الجمهورية، المنصورة'
),
(
  'صيانة دورية للمكيف',
  'فحص وصيانة مكيف الهواء',
  'فاطمة علي',
  '01098765432',
  CURRENT_DATE + INTERVAL '2 days',
  '14:00:00',
  'scheduled',
  90,
  'شارع البحر، الإسكندرية'
);