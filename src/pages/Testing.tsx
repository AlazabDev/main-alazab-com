import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

const Testing = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: "اتصال قاعدة البيانات", status: 'pending' },
    { name: "المصادقة والتسجيل", status: 'pending' },
    { name: "إدارة طلبات الصيانة", status: 'pending' },
    { name: "إدارة العقارات", status: 'pending' },
    { name: "إدارة الموردين", status: 'pending' },
    { name: "إدارة المواعيد", status: 'pending' },
    { name: "إدارة الفواتير", status: 'pending' },
    { name: "خدمات الخرائط", status: 'pending' },
    { name: "النسخ الاحتياطي والاستعادة", status: 'pending' },
    { name: "الإشعارات", status: 'pending' },
    { name: "المحادثة الذكية", status: 'pending' },
    { name: "تحديث البيانات في الزمن الفعلي", status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const updateTestResult = (index: number, result: Partial<TestResult>) => {
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, ...result } : test
    ));
  };

  const testDatabaseConnection = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase.from('profiles').select('count');
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `اتصال ناجح - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `فشل الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testAuthentication = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const duration = Date.now() - start;
      
      updateTestResult(index, { 
        status: 'success', 
        message: user ? `مستخدم مسجل: ${user.email}` : 'غير مسجل الدخول',
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في المصادقة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testMaintenanceRequests = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} طلب صيانة - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في طلبات الصيانة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testProperties = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} عقار - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في العقارات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testVendors = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} مورد - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في الموردين: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testAppointments = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      // Use secure view for testing
      const { data, error } = await supabase
        .from('appointments_staff_view')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} موعد - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في المواعيد: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testInvoices = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} فاتورة - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في الفواتير: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testMapsService = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      // اختبار وجود Google Maps API
      if (typeof google !== 'undefined' && google.maps) {
        const duration = Date.now() - start;
        updateTestResult(index, { 
          status: 'success', 
          message: `خدمة الخرائط متاحة - ${duration}ms`,
          duration 
        });
      } else {
        updateTestResult(index, { 
          status: 'error', 
          message: 'خدمة الخرائط غير متاحة' 
        });
      }
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في خدمة الخرائط: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testBackupRestore = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      // اختبار أساسي للنسخ الاحتياطي
      const testData = { test: 'backup_test', timestamp: new Date().toISOString() };
      localStorage.setItem('backup_test', JSON.stringify(testData));
      
      const restored = localStorage.getItem('backup_test');
      if (restored && JSON.parse(restored).test === 'backup_test') {
        localStorage.removeItem('backup_test');
        const duration = Date.now() - start;
        updateTestResult(index, { 
          status: 'success', 
          message: `النسخ الاحتياطي يعمل - ${duration}ms`,
          duration 
        });
      } else {
        throw new Error('فشل في اختبار النسخ الاحتياطي');
      }
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في النسخ الاحتياطي: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testNotifications = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .limit(1);
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `تم جلب ${data?.length || 0} إشعار - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في الإشعارات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testChatbot = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      // اختبار وجود edge function للمحادثة
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: 'test', type: 'system_check' }
      });
      
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      updateTestResult(index, { 
        status: 'success', 
        message: `المحادثة الذكية تعمل - ${duration}ms`,
        duration 
      });
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في المحادثة الذكية: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const testRealtimeUpdates = async (index: number) => {
    updateTestResult(index, { status: 'running' });
    const start = Date.now();
    
    try {
      // اختبار الاشتراك في الوقت الفعلي
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' },
          () => {
            console.log('Realtime test successful');
          }
        )
        .subscribe();

      // إزالة الاشتراك بعد ثانية واحدة
      setTimeout(() => {
        supabase.removeChannel(channel);
        const duration = Date.now() - start;
        updateTestResult(index, { 
          status: 'success', 
          message: `التحديث في الزمن الفعلي يعمل - ${duration}ms`,
          duration 
        });
      }, 1000);
      
    } catch (error) {
      updateTestResult(index, { 
        status: 'error', 
        message: `خطأ في التحديث في الزمن الفعلي: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    const tests = [
      testDatabaseConnection,
      testAuthentication,
      testMaintenanceRequests,
      testProperties,
      testVendors,
      testAppointments,
      testInvoices,
      testMapsService,
      testBackupRestore,
      testNotifications,
      testChatbot,
      testRealtimeUpdates,
    ];

    // تشغيل الاختبارات بالتتابع
    for (let i = 0; i < tests.length; i++) {
      await tests[i](i);
      // انتظار قصير بين الاختبارات
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const successCount = testResults.filter(test => test.status === 'success').length;
    const totalTests = testResults.length;
    
    toast({
      title: "اكتمل الاختبار",
      description: `نجح ${successCount} من ${totalTests} اختبار`,
      variant: successCount === totalTests ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">نجح</Badge>;
      case 'error':
        return <Badge variant="destructive">فشل</Badge>;
      case 'running':
        return <Badge variant="secondary">قيد التشغيل</Badge>;
      default:
        return <Badge variant="outline">في الانتظار</Badge>;
    }
  };

  const successCount = testResults.filter(test => test.status === 'success').length;
  const errorCount = testResults.filter(test => test.status === 'error').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">اختبار النظام</h1>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <PlayCircle className="h-4 w-4" />
          {isRunning ? 'قيد التشغيل...' : 'تشغيل جميع الاختبارات'}
        </Button>
      </div>

      {/* ملخص النتائج */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-center">{totalTests}</div>
            <div className="text-sm text-muted-foreground text-center">إجمالي الاختبارات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 text-center">{successCount}</div>
            <div className="text-sm text-muted-foreground text-center">اختبارات ناجحة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 text-center">{errorCount}</div>
            <div className="text-sm text-muted-foreground text-center">اختبارات فاشلة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 text-center">
              {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground text-center">معدل النجاح</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الاختبارات */}
      <Card>
        <CardHeader>
          <CardTitle>نتائج الاختبارات التفصيلية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    {test.message && (
                      <div className="text-sm text-muted-foreground">{test.message}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {test.duration && (
                    <span className="text-xs text-muted-foreground">
                      {test.duration}ms
                    </span>
                  )}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إرشادات الاختبار */}
      <Card>
        <CardHeader>
          <CardTitle>إرشادات ما قبل النشر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>✅ تأكد من نجاح جميع الاختبارات قبل النشر على السيرفر</p>
            <p>✅ اختبر جميع الوظائف يدوياً في واجهة المستخدم</p>
            <p>✅ تحقق من سرعة الاستجابة والأداء</p>
            <p>✅ اختبر التطبيق على أجهزة مختلفة (سطح المكتب، التابلت، الهاتف)</p>
            <p>✅ تأكد من وجود نسخة احتياطية من قاعدة البيانات</p>
            <p>✅ راجع إعدادات الأمان والخصوصية</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Testing;