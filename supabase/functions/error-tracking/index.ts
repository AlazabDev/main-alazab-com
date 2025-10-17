import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

// CORS headers - السماح لجميع النطاقات
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  user_id?: string;
  user_agent?: string;
  timestamp?: string;
  level: 'error' | 'warning' | 'info' | 'warn';
  metadata?: Record<string, any>;
  created_at?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    
    // دعم إرسال خطأ واحد أو مصفوفة أخطاء
    const errors = body.errors || [body];
    
    if (!Array.isArray(errors) || errors.length === 0) {
      return new Response(JSON.stringify({ error: 'No errors provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // معالجة وتنظيف كل خطأ
    const sanitizedErrors = errors.map((err: any) => ({
      message: String(err.message || 'Unknown error').slice(0, 1000),
      stack: err.stack ? String(err.stack).slice(0, 5000) : undefined,
      url: err.url ? String(err.url).slice(0, 500) : '',
      user_id: err.user_id || undefined,
      user_agent: err.user_agent ? String(err.user_agent).slice(0, 500) : undefined,
      level: ['error', 'warning', 'info', 'warn'].includes(err.level) ? err.level : 'error',
      metadata: err.metadata || undefined,
      created_at: err.created_at || new Date().toISOString()
    }));

    // تسجيل الأخطاء في قاعدة البيانات
    const { error } = await supabase
      .from('error_logs')
      .insert(sanitizedErrors);

    if (error) {
      console.error('Error saving log:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save log' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // إرسال إشعار للمديرين في حالة الأخطاء الحرجة فقط
    const criticalErrors = sanitizedErrors.filter(e => e.level === 'error');
    if (criticalErrors.length > 0) {
      try {
        // البحث عن المديرين من جدول user_roles
        const { data: admins } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(10);

        if (admins && admins.length > 0) {
          // إرسال إشعار واحد فقط للأخطاء المتعددة
          const notifications = admins.map(admin => ({
            recipient_id: admin.user_id,
            title: 'خطأ تقني في النظام',
            message: criticalErrors.length === 1 
              ? `حدث خطأ تقني: ${criticalErrors[0].message.slice(0, 100)}...`
              : `حدثت ${criticalErrors.length} أخطاء تقنية في النظام`,
            type: 'error',
            entity_type: 'system_error',
            entity_id: null
          }));

          await supabase
            .from('notifications')
            .insert(notifications);
        }
      } catch (notificationError) {
        console.error('Error sending admin notifications:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (err) {
    console.error('Error in error-tracking function:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});