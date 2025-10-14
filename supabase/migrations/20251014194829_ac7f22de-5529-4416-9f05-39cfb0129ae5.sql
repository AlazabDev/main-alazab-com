-- Create system_settings table for platform-wide settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create user_preferences table for user-specific settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_budget numeric(12,2),
  timezone text DEFAULT 'Africa/Cairo',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create platform_permissions table for maintenance request permissions
CREATE TABLE IF NOT EXISTS public.platform_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  can_choose_appointment_date boolean DEFAULT true,
  can_submit_without_manager_approval boolean DEFAULT false,
  can_view_financial_details boolean DEFAULT false,
  can_cancel_requests boolean DEFAULT false,
  can_reject_prices boolean DEFAULT false,
  can_create_properties boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EGP',
  payment_method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create subscription_invoices table
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EGP',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  due_date date NOT NULL,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add new columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female')),
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Africa/Cairo',
  ADD COLUMN IF NOT EXISTS locale text DEFAULT 'ar';

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Admin can manage system settings"
ON public.system_settings FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "All authenticated users can view system settings"
ON public.system_settings FOR SELECT
USING (auth.role() = 'authenticated');

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON public.user_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
ON public.user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for platform_permissions
CREATE POLICY "Users can view own permissions"
ON public.platform_permissions FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage permissions"
ON public.platform_permissions FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage subscriptions"
ON public.subscriptions FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for subscription_invoices
CREATE POLICY "Users can view own subscription invoices"
ON public.subscription_invoices FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.id = subscription_invoices.subscription_id
    AND (s.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admin can manage subscription invoices"
ON public.subscription_invoices FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_permissions_updated_at
  BEFORE UPDATE ON public.platform_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_invoices_updated_at
  BEFORE UPDATE ON public.subscription_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_permissions_user_id ON public.platform_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_subscription_id ON public.subscription_invoices(subscription_id);