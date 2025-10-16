import { MaintenanceRequest } from '@/hooks/useMaintenanceRequests';

/**
 * تنسيق التاريخ بصيغة عربية
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * تنسيق الوقت بصيغة 12 ساعة
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'م' : 'ص';
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * تنسيق التاريخ والوقت معاً
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * حساب الوقت المنقضي منذ إنشاء الطلب
 */
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;
  if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهر`;
  return `منذ ${Math.floor(diffDays / 365)} سنة`;
}

/**
 * تنسيق المبلغ المالي
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (!amount) return '---';
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * تنسيق رقم الهاتف
 */
export function formatPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '---';
  // تنسيق: 01xxxxxxxxx -> 01x-xxxx-xxxx
  if (phone.length === 11 && phone.startsWith('01')) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
  }
  return phone;
}

/**
 * الحصول على اسم نوع الخدمة بالعربية
 */
export function getServiceTypeName(serviceType: string): string {
  const serviceTypes: Record<string, string> = {
    plumbing: 'سباكة',
    electrical: 'كهرباء',
    hvac: 'تكييف',
    carpentry: 'نجارة',
    painting: 'دهانات',
    cleaning: 'تنظيف',
    general: 'صيانة عامة'
  };
  return serviceTypes[serviceType] || serviceType;
}

/**
 * الحصول على اسم الأولوية بالعربية
 */
export function getPriorityName(priority: string): string {
  const priorities: Record<string, string> = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية'
  };
  return priorities[priority] || priority;
}

/**
 * الحصول على اسم الحالة بالعربية
 */
export function getStatusName(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'في الانتظار',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    draft: 'مسودة',
    submitted: 'مُقدم',
    acknowledged: 'تم الاستلام',
    assigned: 'تم التعيين',
    scheduled: 'مجدول',
    inspection: 'تحت الفحص',
    waiting_parts: 'بانتظار قطع غيار',
    billed: 'تم إصدار فاتورة',
    paid: 'مدفوع',
    closed: 'مغلق',
    on_hold: 'معلق'
  };
  return statuses[status] || status;
}

/**
 * حساب نسبة الإنجاز بناءً على الحالة
 */
export function calculateProgress(status: string): number {
  const progressMap: Record<string, number> = {
    draft: 0,
    submitted: 10,
    acknowledged: 20,
    assigned: 30,
    scheduled: 40,
    pending: 40,
    in_progress: 60,
    inspection: 70,
    waiting_parts: 50,
    completed: 90,
    billed: 95,
    paid: 100,
    closed: 100,
    cancelled: 0,
    on_hold: 30
  };
  return progressMap[status] || 0;
}

/**
 * التحقق من تأخر الطلب بناءً على SLA
 */
export function isRequestOverdue(request: MaintenanceRequest): boolean {
  if (!request.sla_due_date) return false;
  const dueDate = new Date(request.sla_due_date);
  const now = new Date();
  return now > dueDate && !['completed', 'cancelled', 'closed'].includes(request.status);
}

/**
 * حساب الأيام المتبقية حتى الموعد النهائي
 */
export function getDaysRemaining(slaDueDate: string | undefined): number | null {
  if (!slaDueDate) return null;
  const dueDate = new Date(slaDueDate);
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
}
