-- Fix function search path security warnings
-- Add proper search_path settings to all database functions

-- 1. Fix calculate_item_total function
CREATE OR REPLACE FUNCTION public.calculate_item_total()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  NEW.total_price = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$function$;

-- 2. Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  year_month := to_char(CURRENT_DATE, 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_month || '-%';
  
  RETURN 'INV-' || year_month || '-' || LPAD(sequence_num::TEXT, 3, '0');
END;
$function$;

-- 3. Fix set_invoice_number function
CREATE OR REPLACE FUNCTION public.set_invoice_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. Fix is_staff function
CREATE OR REPLACE FUNCTION public.is_staff(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  select exists (select 1 from profiles p where p.user_id = uid and p.role in ('admin','staff'));
$function$;

-- 5. Fix is_vendor function
CREATE OR REPLACE FUNCTION public.is_vendor(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  select exists (select 1 from profiles p where p.user_id = uid and p.role = 'vendor');
$function$;

-- 6. Fix services_tsvector_trigger function
CREATE OR REPLACE FUNCTION public.services_tsvector_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  new.search_keywords := to_tsvector('simple', coalesce(new.name,'') || ' ' || coalesce(new.description,''));
  return new;
end $function$;

-- 7. Fix recalc_request_totals function
CREATE OR REPLACE FUNCTION public.recalc_request_totals(p_request_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
declare
  v_subtotal numeric(12,2);
  v_vat numeric(12,2);
begin
  select
    coalesce(sum(rl.qty * rl.rate), 0),
    coalesce(sum(rl.vat_amount), 0)
  into v_subtotal, v_vat
  from request_lines rl
  where rl.request_id = p_request_id;

  update service_requests
  set subtotal = v_subtotal,
      vat_amount = v_vat,
      total = v_subtotal + v_vat
  where id = p_request_id;
end
$function$;

-- 8. Fix set_line_amounts function
CREATE OR REPLACE FUNCTION public.set_line_amounts()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  new.amount := round(coalesce(new.qty,1) * coalesce(new.rate,0), 2);
  new.vat_amount := round(new.amount * coalesce(new.vat_rate, 0.14), 2);
  return new;
end
$function$;

-- 9. Fix trg_recalc_request_totals function
CREATE OR REPLACE FUNCTION public.trg_recalc_request_totals()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  perform recalc_request_totals(coalesce(new.request_id, old.request_id));
  return null;
end $function$;

-- 10. Fix update_paid_on_payment function
CREATE OR REPLACE FUNCTION public.update_paid_on_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  if new.status = 'captured' then
    update service_requests sr
    set paid_amount = (
      select coalesce(sum(amount),0) from payments p
      where p.request_id = sr.id and p.status = 'captured'
    )
    where sr.id = new.request_id;
  end if;
  return new;
end $function$;

-- 11. Fix calculate_distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$function$;

-- 12. Fix find_nearest_vendor function
CREATE OR REPLACE FUNCTION public.find_nearest_vendor(request_latitude numeric, request_longitude numeric, service_specialization text DEFAULT NULL::text)
 RETURNS TABLE(vendor_id uuid, vendor_name text, distance numeric, phone text, email text)
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    calculate_distance(request_latitude, request_longitude, vl.latitude, vl.longitude) as dist,
    v.phone,
    v.email
  FROM vendors v
  JOIN vendor_locations vl ON v.id = vl.vendor_id
  WHERE v.status = 'active' 
    AND vl.is_active = true
    AND (service_specialization IS NULL OR service_specialization = ANY(v.specialization))
  ORDER BY dist ASC
  LIMIT 5;
END;
$function$;