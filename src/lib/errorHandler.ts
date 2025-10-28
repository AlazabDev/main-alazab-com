// نظام معالجة الأخطاء المحسن للإنتاج
import { supabase } from '@/integrations/supabase/client';

export interface ErrorLog {
  id?: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  url: string;
  user_id?: string;
  user_agent: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

class ErrorHandler {
  private maxErrors = 50; // أقصى عدد أخطاء في الذاكرة
  private errorQueue: ErrorLog[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.setupGlobalErrorHandlers();
    this.setupNetworkListeners();
  }

  private setupGlobalErrorHandlers() {
    // معالج الأخطاء الشامل
    window.addEventListener('error', (event) => {
      this.logError({
        level: 'error',
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        metadata: {
          line: event.lineno,
          column: event.colno,
          type: 'javascript'
        }
      });
    });

    // معالج أخطاء Promise غير المعالجة
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        level: 'error',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        metadata: {
          type: 'promise',
          reason: event.reason
        }
      });
    });
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async logError(error: Partial<ErrorLog>) {
    const errorLog: ErrorLog = {
      level: error.level || 'error',
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url || window.location.href,
      user_agent: navigator.userAgent,
      metadata: error.metadata,
      created_at: new Date().toISOString()
    };

    // إضافة معرف المستخدم إذا كان متاحاً
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        errorLog.user_id = user.id;
      }
    } catch {
      // تجاهل خطأ الحصول على المستخدم
    }

    // إضافة للطابور
    this.errorQueue.push(errorLog);
    
    // الحفاظ على حد أقصى من الأخطاء
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }

    // إرسال فوري إذا كان الاتصال متاح
    if (this.isOnline) {
      await this.flushErrorQueue();
    }

    // طباعة في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }
  }

  private async flushErrorQueue() {
    if (this.errorQueue.length === 0 || !this.isOnline) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // تحقق من وجود session أولاً
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // إذا لم يكن هناك session، احتفظ بالأخطاء محلياً فقط
        console.log('[Dev] Error logs stored locally (no session)');
        return;
      }

      // إرسال الأخطاء للخادم
      const { error } = await supabase.functions.invoke('error-tracking', {
        body: { errors: errorsToSend }
      });

      if (error) {
        // إعادة الأخطاء للطابور في حالة الفشل
        this.errorQueue.unshift(...errorsToSend);
        console.warn('Failed to send error logs:', error);
      }
    } catch (error) {
      // إعادة الأخطاء للطابور في حالة الفشل
      this.errorQueue.unshift(...errorsToSend);
      console.warn('Failed to send error logs:', error);
    }
  }

  // تسجيل أخطاء مخصصة
  async logCustomError(message: string, metadata?: Record<string, any>) {
    await this.logError({
      level: 'error',
      message,
      metadata: {
        ...metadata,
        type: 'custom'
      }
    });
  }

  // تسجيل تحذيرات
  async logWarning(message: string, metadata?: Record<string, any>) {
    await this.logError({
      level: 'warn',
      message,
      metadata: {
        ...metadata,
        type: 'warning'
      }
    });
  }

  // تسجيل معلومات
  async logInfo(message: string, metadata?: Record<string, any>) {
    await this.logError({
      level: 'info',
      message,
      metadata: {
        ...metadata,
        type: 'info'
      }
    });
  }

  // مسح الطابور
  clearQueue() {
    this.errorQueue = [];
  }

  // الحصول على حالة الطابور
  getQueueStatus() {
    return {
      queueLength: this.errorQueue.length,
      isOnline: this.isOnline,
      maxErrors: this.maxErrors
    };
  }
}

// إنشاء instance وحيد
export const errorHandler = new ErrorHandler();

// دوال مساعدة للاستخدام السهل
export const logError = (message: string, metadata?: Record<string, any>) => 
  errorHandler.logCustomError(message, metadata);

export const logWarning = (message: string, metadata?: Record<string, any>) => 
  errorHandler.logWarning(message, metadata);

export const logInfo = (message: string, metadata?: Record<string, any>) => 
  errorHandler.logInfo(message, metadata);

// معالج أخطاء React Error Boundary
export const handleReactError = (error: Error, errorInfo: any) => {
  errorHandler.logError({
    level: 'error',
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    metadata: {
      type: 'react',
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }
  });
};