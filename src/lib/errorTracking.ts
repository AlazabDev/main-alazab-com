import { supabase } from '@/integrations/supabase/client';

interface ErrorTrackingData {
  message: string;
  stack?: string;
  level?: 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private isEnabled = process.env.NODE_ENV === 'production';

  async track(error: Error | string, data?: Partial<ErrorTrackingData>) {
    if (!this.isEnabled) {
      console.error('Error tracked:', error, data);
      return;
    }

    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const stack = error instanceof Error ? error.stack : undefined;

      const payload: ErrorTrackingData & { 
        url: string; 
        user_agent: string; 
        timestamp: string;
        user_id?: string;
      } = {
        message: errorMessage,
        stack,
        url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        level: data?.level || 'error',
        metadata: data?.metadata,
        ...data
      };

      // إضافة معرف المستخدم إذا كان متصلاً
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        payload.user_id = user.id;
      }

      // إرسال الخطأ إلى edge function
      await supabase.functions.invoke('error-tracking', {
        body: payload
      });

    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
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
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorTracker.track(event.error || event.message, {
      metadata: {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.track(event.reason, {
      metadata: {
        type: 'unhandled_rejection'
      }
    });
  });
}