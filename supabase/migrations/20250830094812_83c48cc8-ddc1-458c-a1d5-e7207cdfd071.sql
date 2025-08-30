-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  due_date DATE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table for line items
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own invoices" 
ON public.invoices 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create policies for invoice items
CREATE POLICY "Users can view their invoice items" 
ON public.invoice_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.created_by = auth.uid()
));

CREATE POLICY "Users can create invoice items" 
ON public.invoice_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.created_by = auth.uid()
));

CREATE POLICY "Users can update invoice items" 
ON public.invoice_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.created_by = auth.uid()
));

CREATE POLICY "Users can delete invoice items" 
ON public.invoice_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.created_by = auth.uid()
));

-- Create trigger to update total_price automatically
CREATE OR REPLACE FUNCTION calculate_item_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_item_total
  BEFORE INSERT OR UPDATE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_item_total();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();