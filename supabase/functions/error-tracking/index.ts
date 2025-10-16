import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

// تحديد CORS للنطاق المحدد فقط لتحسين الأمان
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://zrrffsjbfkphridqyais.supabase.co',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  user_id?: string;
  user_agent?: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
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
    
    // Enhanced input validation
    if (!body.message || typeof body.message !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Sanitize and validate input with length limits
    const errorData: ErrorLog = {
      message: body.message.slice(0, 1000),
      stack: body.stack ? body.stack.slice(0, 5000) : undefined,
      url: body.url ? body.url.slice(0, 500) : '',
      user_id: body.user_id || undefined,
      user_agent: body.user_agent ? body.user_agent.slice(0, 500) : undefined,
      level: ['error', 'warning', 'info'].includes(body.level) ? body.level : 'error',
      metadata: body.metadata || undefined,
      timestamp: new Date().toISOString()
    };

    // تسجيل الخطأ في قاعدة البيانات
    const { error } = await supabase
      .from('error_logs')
      .insert([{
        message: errorData.message,
        stack: errorData.stack,
        url: errorData.url,
        user_id: errorData.user_id,
        user_agent: errorData.user_agent,
        level: errorData.level,
        metadata: errorData.metadata,
        created_at: errorData.timestamp
      }]);

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

    // إرسال إشعار للمديرين في حالة الأخطاء الحرجة
    if (errorData.level === 'error') {
      try {
        // البحث عن المديرين من جدول user_roles (آمن)
        const { data: admins } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(10); // Limit to prevent abuse

        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            recipient_id: admin.user_id,
            title: 'خطأ تقني في النظام',
            message: `حدث خطأ تقني: ${errorData.message.slice(0, 100)}...`,
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