import { supabase } from '@/integrations/supabase/client';

interface ErrorTrackingData {
  message: string;
  stack?: string;
  level?: 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private isEnabled = import.meta.env.PROD; // تفعيل في الإنتاج فقط

  async track(error: Error | string, data?: Partial<ErrorTrackingData>) {
    // تسجيل في console دائماً
    if (!import.meta.env.PROD) {
      console.error('Error tracked:', error, data);
    }

    // إرسال للسيرفر في الإنتاج فقط مع authentication
    if (!this.isEnabled) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const errorData = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        level: data?.level || 'error',
        metadata: {
          ...data?.metadata,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }
      };

      // استخدام Edge Function مع JWT authentication
      await supabase.functions.invoke('error-tracking', {
        body: errorData
      });
    } catch (err) {
      // فشل صامت لتجنب حلقة الأخطاء
      console.error('Failed to track error:', err);
    }
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

// إعداد تتبع الأخطاء العامة
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    errorTracker.track(event.error || event.message, {
      level: 'error',
      metadata: { type: 'global_error' }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.track(event.reason, {
      level: 'error',
      metadata: { type: 'unhandled_rejection' }
    });
  });
}
