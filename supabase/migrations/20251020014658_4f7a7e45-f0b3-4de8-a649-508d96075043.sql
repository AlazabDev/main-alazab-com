-- ============================================
-- إضافة Policies المفقودة (بناءً على البنية الفعلية)
-- ============================================

-- 1. mall_tenants - لا يوجد أي policies
CREATE POLICY "mall_tenants_select" ON public.mall_tenants
FOR SELECT USING (true);

CREATE POLICY "mall_tenants_staff_manage" ON public.mall_tenants
FOR ALL USING (is_staff(auth.uid()));

-- 2. request_events - يوجد INSERT فقط، نحتاج SELECT
CREATE POLICY "request_events_select" ON public.request_events
FOR SELECT USING (is_staff(auth.uid()));

-- 3. maintenance_requests - إضافة الـ policies المفقودة
-- SELECT: الموظفين والعملاء في نفس الشركة
CREATE POLICY "maintenance_requests_select" ON public.maintenance_requests
FOR SELECT USING (
  created_by = auth.uid() OR 
  is_staff(auth.uid()) OR
  company_id = get_current_user_company_id()
);

-- INSERT: أي شخص في نفس الشركة
CREATE POLICY "maintenance_requests_insert" ON public.maintenance_requests
FOR INSERT WITH CHECK (
  created_by = auth.uid() OR 
  is_staff(auth.uid())
);

-- UPDATE: الموظفين ومن أنشأ الطلب والمستخدمين في نفس الشركة
CREATE POLICY "maintenance_requests_update" ON public.maintenance_requests
FOR UPDATE USING (
  created_by = auth.uid() OR 
  is_staff(auth.uid()) OR
  company_id = get_current_user_company_id()
);

-- DELETE: فقط الموظفين
CREATE POLICY "maintenance_requests_delete" ON public.maintenance_requests
FOR DELETE USING (is_staff(auth.uid()));