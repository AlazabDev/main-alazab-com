-- إنشاء جدول تتبع الأخطاء
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  stack text,
  url text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent text,
  level text NOT NULL DEFAULT 'error' CHECK (level IN ('error', 'warning', 'info')),
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- تفعيل RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان - المديرون فقط يمكنهم رؤية وإدارة الأخطاء
CREATE POLICY "المديرون يمكنهم رؤية جميع الأخطاء" 
ON public.error_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['admin', 'manager'])
  )
);

CREATE POLICY "المديرون يمكنهم تحديث الأخطاء" 
ON public.error_logs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['admin', 'manager'])
  )
);

-- فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_error_logs_level_date 
ON error_logs (level, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_date 
ON error_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_resolved 
ON error_logs (resolved_at) 
WHERE resolved_at IS NULL;