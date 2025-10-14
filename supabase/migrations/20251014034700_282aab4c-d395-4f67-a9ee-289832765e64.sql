-- ============================================
-- إصلاح جداول الخدمات: تحويل ID من TEXT إلى UUID
-- ============================================

-- 1. حذف الجداول القديمة بالترتيب الصحيح
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.service_subcategories CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;
DROP TABLE IF EXISTS public.service_price_tiers CASCADE;

-- 2. إنشاء جدول التصنيفات الرئيسية
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. إنشاء جدول التصنيفات الفرعية
CREATE TABLE public.service_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. إنشاء جدول الخدمات
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.service_subcategories(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  unit TEXT,
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'per_unit', 'per_hour', 'per_sqm')),
  base_price NUMERIC(12,2) DEFAULT 0,
  min_qty NUMERIC(10,3) DEFAULT 1,
  max_qty NUMERIC(10,3),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. إنشاء جدول مستويات الأسعار
CREATE TABLE public.service_price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  min_quantity NUMERIC(10,3),
  max_quantity NUMERIC(10,3),
  price NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, tier_name)
);

-- 6. إنشاء الفهارس
CREATE INDEX idx_service_categories_active ON public.service_categories(is_active) WHERE is_active = true;
CREATE INDEX idx_service_subcategories_category ON public.service_subcategories(category_id);
CREATE INDEX idx_service_subcategories_active ON public.service_subcategories(is_active) WHERE is_active = true;
CREATE INDEX idx_services_subcategory ON public.services(subcategory_id);
CREATE INDEX idx_services_active ON public.services(is_active) WHERE is_active = true;
CREATE INDEX idx_services_code ON public.services(code);
CREATE INDEX idx_service_price_tiers_service ON public.service_price_tiers(service_id);

-- 7. تفعيل RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_price_tiers ENABLE ROW LEVEL SECURITY;

-- 8. إنشاء Policies
-- التصنيفات: قراءة للجميع، إدارة للموظفين فقط
CREATE POLICY "service_categories_read" ON public.service_categories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "service_categories_manage" ON public.service_categories 
  FOR ALL USING (is_staff(auth.uid()));

-- التصنيفات الفرعية
CREATE POLICY "service_subcategories_read" ON public.service_subcategories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "service_subcategories_manage" ON public.service_subcategories 
  FOR ALL USING (is_staff(auth.uid()));

-- الخدمات
CREATE POLICY "services_read" ON public.services 
  FOR SELECT USING (is_active = true);

CREATE POLICY "services_manage" ON public.services 
  FOR ALL USING (is_staff(auth.uid()));

-- مستويات الأسعار
CREATE POLICY "service_price_tiers_read" ON public.service_price_tiers 
  FOR SELECT USING (is_active = true);

CREATE POLICY "service_price_tiers_manage" ON public.service_price_tiers 
  FOR ALL USING (is_staff(auth.uid()));

-- 9. إضافة Triggers لتحديث updated_at
CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON public.service_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_subcategories_updated_at
  BEFORE UPDATE ON public.service_subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.service_categories IS 'التصنيفات الرئيسية للخدمات';
COMMENT ON TABLE public.service_subcategories IS 'التصنيفات الفرعية للخدمات';
COMMENT ON TABLE public.services IS 'جدول الخدمات - UUID معد للتوافق مع request_lines';
COMMENT ON TABLE public.service_price_tiers IS 'مستويات التسعير حسب الكمية';