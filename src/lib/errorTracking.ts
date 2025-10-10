import { supabase } from '@/integrations/supabase/client';

interface ErrorTrackingData {
  message: string;
  stack?: string;
  level?: 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private isEnabled = false; // تعطيل تتبع الأخطاء مؤقتاً لتحسين الأداء

  async track(error: Error | string, data?: Partial<ErrorTrackingData>) {
    // تسجيل في console فقط بدون إرسال للسيرفر
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracked:', error, data);
    }
    return; // إيقاف الإرسال للسيرفر مؤقتاً
  }

  trackApiError(error: any, endpoint: string, method: string) {
    this.track(error, {
      level: 'error',
      metadata: {
        type: 'api_error',
        endpoint,
        method,
        status: error?.status,
        statusText: error?.statusText
      }
    });
  }

  trackUserAction(action: string, metadata?: Record<string, any>) {
    this.track(`User action: ${action}`, {
      level: 'info',
      metadata: {
        type: 'user_action',
        action,
        ...metadata
      }
    });
  }

  trackPerformance(metric: string, value: number, metadata?: Record<string, any>) {
    this.track(`Performance: ${metric}`, {
      level: 'info',
      metadata: {
        type: 'performance',
        metric,
        value,
        ...metadata
      }
    });
  }
}

export const errorTracker = new ErrorTracker();

// إعداد تتبع الأخطاء العامة (معطل مؤقتاً)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
  });
}
