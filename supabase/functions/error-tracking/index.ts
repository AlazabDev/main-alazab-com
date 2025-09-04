import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

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
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const errorData: ErrorLog = await req.json();

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
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving log:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // إرسال إشعار للمديرين في حالة الأخطاء الحرجة
    if (errorData.level === 'error') {
      try {
        // البحث عن المديرين
        const { data: admins } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('role', 'admin');

        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            recipient_id: admin.user_id,
            title: 'خطأ تقني في النظام',
            message: `حدث خطأ تقني: ${errorData.message}`,
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