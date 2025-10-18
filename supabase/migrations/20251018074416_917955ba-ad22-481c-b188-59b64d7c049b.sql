-- ============================================
-- دورة حياة طلب الصيانة - النظام الاحترافي الكامل
-- ============================================

-- 1) تحديث enum الحالات (Stages)
DO $$ BEGIN
  CREATE TYPE maintenance_stage AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'TRIAGED',
    'ASSIGNED',
    'SCHEDULED',
    'IN_PROGRESS',
    'INSPECTION',
    'COMPLETED',
    'BILLED',
    'PAID',
    'CLOSED',
    'ON_HOLD',
    'WAITING_PARTS',
    'CANCELLED',
    'REJECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) جدول الفروع داخل المول (mall_branches)
CREATE TABLE IF NOT EXISTS mall_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_id integer REFERENCES malls(id) ON DELETE CASCADE,
  store_id uuid REFERENCES stores(id) ON DELETE SET NULL,
  branch_code text NOT NULL,
  unit_no text,
  floor text,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (mall_id, branch_code)
);

-- 3) جدول المستأجرين (Tenants)
CREATE TABLE IF NOT EXISTS mall_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  brand_code text,
  contact_email text,
  created_at timestamptz DEFAULT now()
);

-- إضافة tenant_id للفروع
ALTER TABLE mall_branches 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES mall_tenants(id) ON DELETE SET NULL;

-- 4) جدول سجل الأحداث (Request Events) - الأساس التدقيقي
CREATE TABLE IF NOT EXISTS request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  event_type text NOT NULL,
  from_stage text,
  to_stage text,
  by_user uuid REFERENCES auth.users(id),
  notes text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  nonce text,
  UNIQUE (request_id, event_type, nonce)
);

CREATE INDEX IF NOT EXISTS idx_request_events_request ON request_events(request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_events_type ON request_events(event_type);

-- 5) جدول اتصالات الفنيين (Vendor Communications)
CREATE TABLE IF NOT EXISTS vendor_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL,
  msg text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_comm_request ON vendor_communications(request_id, vendor_id, created_at);

-- 6) جدول طلبات قطع الغيار
CREATE TABLE IF NOT EXISTS parts_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  item_id uuid,
  qty numeric NOT NULL,
  status text DEFAULT 'ordered' CHECK (status IN ('ordered', 'received', 'cancelled')),
  vendor_ref text,
  estimated_cost numeric,
  actual_cost numeric,
  received_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7) جدول قوائم التحقق (Checklists)
CREATE TABLE IF NOT EXISTS service_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  item text NOT NULL,
  required boolean DEFAULT false,
  evidence_type text CHECK (evidence_type IN ('photo', 'reading', 'form', 'video')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 8) جدول سياسات SLA
CREATE TABLE IF NOT EXISTS sla_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  priority text NOT NULL,
  accept_within_min integer NOT NULL,
  arrive_within_min integer NOT NULL,
  complete_within_min integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (category_id, priority)
);

-- إدراج سياسات SLA افتراضية
INSERT INTO sla_policies (category_id, priority, accept_within_min, arrive_within_min, complete_within_min)
VALUES 
  (NULL, 'high', 15, 120, 240),
  (NULL, 'medium', 30, 240, 480),
  (NULL, 'low', 60, 480, 1440)
ON CONFLICT DO NOTHING;

-- 9) تحديث جدول maintenance_requests
ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS source text DEFAULT 'portal',
ADD COLUMN IF NOT EXISTS mall_id integer REFERENCES malls(id),
ADD COLUMN IF NOT EXISTS mall_branch_id uuid REFERENCES mall_branches(id),
ADD COLUMN IF NOT EXISTS mall_payload jsonb,
ADD COLUMN IF NOT EXISTS stage maintenance_stage DEFAULT 'SUBMITTED',
ADD COLUMN IF NOT EXISTS sla_accept_due timestamptz,
ADD COLUMN IF NOT EXISTS sla_arrive_due timestamptz,
ADD COLUMN IF NOT EXISTS sla_complete_due timestamptz,
ADD COLUMN IF NOT EXISTS quality_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS inspection_approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS inspection_approved_at timestamptz,
ADD COLUMN IF NOT EXISTS billed_at timestamptz,
ADD COLUMN IF NOT EXISTS paid_at timestamptz,
ADD COLUMN IF NOT EXISTS invoice_id uuid;

-- 10) Functions للتحقق من الصلاحيات والانتقالات

-- دالة التحقق من صلاحية الانتقال
CREATE OR REPLACE FUNCTION can_transition_stage(
  current_stage text,
  next_stage text,
  user_role text
) RETURNS boolean AS $$
BEGIN
  -- قواعد الانتقال الأساسية
  IF current_stage = 'DRAFT' AND next_stage = 'SUBMITTED' THEN
    RETURN user_role IN ('customer', 'dispatcher', 'admin');
  ELSIF current_stage = 'SUBMITTED' AND next_stage = 'TRIAGED' THEN
    RETURN user_role IN ('dispatcher', 'staff', 'admin', 'manager');
  ELSIF current_stage = 'TRIAGED' AND next_stage = 'ASSIGNED' THEN
    RETURN user_role IN ('dispatcher', 'admin', 'manager');
  ELSIF current_stage = 'ASSIGNED' AND next_stage = 'SCHEDULED' THEN
    RETURN user_role IN ('dispatcher', 'vendor', 'admin', 'manager');
  ELSIF current_stage = 'SCHEDULED' AND next_stage = 'IN_PROGRESS' THEN
    RETURN user_role IN ('vendor', 'technician', 'admin');
  ELSIF current_stage = 'IN_PROGRESS' AND next_stage = 'INSPECTION' THEN
    RETURN user_role IN ('vendor', 'technician', 'admin');
  ELSIF current_stage = 'INSPECTION' AND next_stage = 'COMPLETED' THEN
    RETURN user_role IN ('admin', 'manager');
  ELSIF current_stage = 'INSPECTION' AND next_stage = 'REJECTED' THEN
    RETURN user_role IN ('admin', 'manager');
  ELSIF current_stage = 'REJECTED' AND next_stage = 'IN_PROGRESS' THEN
    RETURN user_role IN ('dispatcher', 'admin', 'manager');
  ELSIF current_stage = 'COMPLETED' AND next_stage = 'BILLED' THEN
    RETURN user_role IN ('finance', 'admin');
  ELSIF current_stage = 'BILLED' AND next_stage = 'PAID' THEN
    RETURN user_role IN ('finance', 'admin');
  ELSIF current_stage = 'PAID' AND next_stage = 'CLOSED' THEN
    RETURN user_role IN ('admin', 'manager');
  -- المسارات الجانبية
  ELSIF next_stage IN ('ON_HOLD', 'WAITING_PARTS', 'CANCELLED') THEN
    RETURN user_role IN ('dispatcher', 'admin', 'manager');
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- دالة حساب SLA
CREATE OR REPLACE FUNCTION calculate_sla_deadlines(
  p_request_id uuid,
  p_priority text,
  p_category_id uuid DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_policy record;
  v_created_at timestamptz;
BEGIN
  -- جلب سياسة SLA
  SELECT * INTO v_policy
  FROM sla_policies
  WHERE (category_id = p_category_id OR category_id IS NULL)
    AND priority = p_priority
  ORDER BY category_id NULLS LAST
  LIMIT 1;
  
  IF NOT FOUND THEN RETURN; END IF;
  
  SELECT created_at INTO v_created_at
  FROM maintenance_requests
  WHERE id = p_request_id;
  
  -- تحديث المواعيد النهائية
  UPDATE maintenance_requests
  SET 
    sla_accept_due = v_created_at + (v_policy.accept_within_min || ' minutes')::interval,
    sla_arrive_due = v_created_at + (v_policy.arrive_within_min || ' minutes')::interval,
    sla_complete_due = v_created_at + (v_policy.complete_within_min || ' minutes')::interval
  WHERE id = p_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger لتسجيل الأحداث تلقائياً
CREATE OR REPLACE FUNCTION log_request_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.stage IS DISTINCT FROM NEW.stage) THEN
    INSERT INTO request_events (
      request_id, 
      event_type, 
      from_stage, 
      to_stage, 
      by_user,
      meta,
      nonce
    ) VALUES (
      NEW.id,
      'stage_change',
      OLD.stage::text,
      NEW.stage::text,
      auth.uid(),
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'timestamp', now()
      ),
      gen_random_uuid()::text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_log_stage_change ON maintenance_requests;
CREATE TRIGGER trg_log_stage_change
  AFTER UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION log_request_stage_change();

-- Trigger لحساب SLA عند إنشاء الطلب
CREATE OR REPLACE FUNCTION set_request_sla()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_sla_deadlines(NEW.id, NEW.priority, NEW.category_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_sla ON maintenance_requests;
CREATE TRIGGER trg_set_sla
  AFTER INSERT ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_sla();

-- 11) RLS Policies

-- request_events
ALTER TABLE request_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY request_events_select ON request_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      WHERE mr.id = request_events.request_id
        AND (mr.requested_by = auth.uid() OR is_staff(auth.uid()))
    )
  );

CREATE POLICY request_events_insert ON request_events
  FOR INSERT WITH CHECK (is_staff(auth.uid()));

-- vendor_communications
ALTER TABLE vendor_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendor_comm_select ON vendor_communications
  FOR SELECT USING (
    vendor_id = auth.uid() OR is_staff(auth.uid())
  );

CREATE POLICY vendor_comm_insert ON vendor_communications
  FOR INSERT WITH CHECK (
    vendor_id = auth.uid() OR is_staff(auth.uid())
  );

-- mall_branches
ALTER TABLE mall_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY mall_branches_read ON mall_branches
  FOR SELECT USING (true);

CREATE POLICY mall_branches_manage ON mall_branches
  FOR ALL USING (is_staff(auth.uid()));

-- parts_orders
ALTER TABLE parts_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY parts_orders_read ON parts_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests mr
      WHERE mr.id = parts_orders.request_id
        AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid() OR is_staff(auth.uid()))
    )
  );

CREATE POLICY parts_orders_manage ON parts_orders
  FOR ALL USING (is_staff(auth.uid()));

-- service_checklists
ALTER TABLE service_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY checklists_read ON service_checklists
  FOR SELECT USING (true);

CREATE POLICY checklists_manage ON service_checklists
  FOR ALL USING (is_staff(auth.uid()));

-- sla_policies
ALTER TABLE sla_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY sla_policies_read ON sla_policies
  FOR SELECT USING (true);

CREATE POLICY sla_policies_manage ON sla_policies
  FOR ALL USING (is_staff(auth.uid()));

-- 12) Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_requests_stage ON maintenance_requests(stage, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_mall ON maintenance_requests(mall_id, mall_branch_id);
CREATE INDEX IF NOT EXISTS idx_requests_sla ON maintenance_requests(sla_complete_due) WHERE stage NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED');
CREATE INDEX IF NOT EXISTS idx_parts_orders_request ON parts_orders(request_id);
CREATE INDEX IF NOT EXISTS idx_branches_mall ON mall_branches(mall_id);

COMMENT ON TABLE request_events IS 'سجل الأحداث غير القابل للتلاعب - كل تغيير في الطلب يُسجل هنا';
COMMENT ON TABLE vendor_communications IS 'اتصالات الفنيين مع الطلبات - يُستخدم لتتبع أول رد';
COMMENT ON TABLE parts_orders IS 'طلبات قطع الغيار المرتبطة بطلبات الصيانة';
COMMENT ON TABLE service_checklists IS 'قوائم التحقق القابلة للتخصيص حسب فئة الخدمة';
COMMENT ON TABLE sla_policies IS 'سياسات SLA حسب الأولوية والفئة';