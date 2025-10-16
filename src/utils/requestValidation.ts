import { z } from 'zod';

// تعريف schema للتحقق من صحة بيانات طلب الصيانة
export const maintenanceRequestSchema = z.object({
  title: z.string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(100, 'العنوان يجب ألا يتجاوز 100 حرف'),
  
  description: z.string()
    .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
    .max(1000, 'الوصف يجب ألا يتجاوز 1000 حرف')
    .optional(),
  
  client_name: z.string()
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(50, 'الاسم يجب ألا يتجاوز 50 حرف'),
  
  client_phone: z.string()
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'رقم هاتف مصري غير صحيح (01xxxxxxxxx)'),
  
  client_email: z.string()
    .email('بريد إلكتروني غير صحيح')
    .optional()
    .or(z.literal('')),
  
  location: z.string()
    .min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل')
    .max(200, 'العنوان يجب ألا يتجاوز 200 حرف'),
  
  service_type: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'carpentry',
    'painting',
    'cleaning',
    'general'
  ], {
    errorMap: () => ({ message: 'نوع الخدمة غير صحيح' })
  }),
  
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'الأولوية غير صحيحة' })
  }),
  
  preferred_date: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'التاريخ يجب أن يكون اليوم أو في المستقبل'),
  
  preferred_time: z.string().optional(),
  
  customer_notes: z.string()
    .max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف')
    .optional(),
  
  latitude: z.number()
    .min(-90, 'خط العرض غير صحيح')
    .max(90, 'خط العرض غير صحيح')
    .optional()
    .nullable(),
  
  longitude: z.number()
    .min(-180, 'خط الطول غير صحيح')
    .max(180, 'خط الطول غير صحيح')
    .optional()
    .nullable(),
  
  property_id: z.string()
    .uuid('معرف العقار غير صحيح')
    .optional()
});

export type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>;

// دالة للتحقق من البيانات وإرجاع الأخطاء
export function validateMaintenanceRequest(data: any) {
  try {
    maintenanceRequestSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'خطأ غير معروف' }] };
  }
}

// دالة للتحقق من الحقول الإلزامية فقط
export function validateRequiredFields(data: Partial<MaintenanceRequestFormData>) {
  const requiredFields = ['title', 'client_name', 'client_phone', 'location', 'service_type'];
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field as keyof MaintenanceRequestFormData]) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
