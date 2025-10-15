-- جدول المصروفات (Expenses)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  maintenance_request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'maintenance', 'services', 'other'
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS Policies for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses_select" ON public.expenses
  FOR SELECT USING (
    is_staff(auth.uid()) OR auth.uid() = created_by
  );

CREATE POLICY "expenses_insert" ON public.expenses
  FOR INSERT WITH CHECK (
    is_staff(auth.uid()) OR auth.uid() = created_by
  );

CREATE POLICY "expenses_update" ON public.expenses
  FOR UPDATE USING (
    is_staff(auth.uid())
  );

CREATE POLICY "expenses_delete" ON public.expenses
  FOR DELETE USING (
    is_staff(auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expenses_request_id ON public.expenses(request_id);
CREATE INDEX IF NOT EXISTS idx_expenses_maintenance_request_id ON public.expenses(maintenance_request_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- Trigger for updated_at
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();