import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/forms/ImageUpload";
import type { Service } from "@/hooks/useServices";

const formSchema = z.object({
  property_id: z.string().optional(),
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  client_name: z.string().min(1, "اسم العميل مطلوب"),
  client_phone: z.string().optional(),
  client_email: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  location: z.string().min(1, "الموقع مطلوب"),
  address: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  temp_contact_name: z.string().optional(),
  temp_contact_country_code: z.string().default("+20"),
  temp_contact_phone: z.string().optional(),
});

interface RequestDetailsStepProps {
  selectedServices: string[];
  onBack: () => void;
}

export const RequestDetailsStep = ({ selectedServices, onBack }: RequestDetailsStepProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temp_contact_country_code: "+20"
    }
  });

  useEffect(() => {
    fetchServices();
    fetchProperties();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .in('id', selectedServices);
    if (data) setServices(data);
  };

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');
    if (data) setProperties(data);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // حساب التكاليف
      const totalServicePrice = services.reduce((sum, s) => sum + Number(s.base_price), 0);
      const inspectionPrice = services.some(s => s.requires_inspection) 
        ? services.find(s => s.requires_inspection)?.inspection_price || 0 
        : 0;
      const taxAmount = (totalServicePrice + inspectionPrice) * 0.14;

      // إنشاء طلب الصيانة
      const { data: request, error: requestError } = await supabase
        .from('maintenance_requests')
        .insert([{
          title: values.title,
          description: values.description,
          client_name: values.client_name,
          client_phone: values.client_phone,
          client_email: values.client_email,
          location: values.location,
          address: values.address,
          preferred_date: values.preferred_date,
          preferred_time: values.preferred_time,
          property_id: values.property_id,
          temp_contact_name: values.temp_contact_name,
          temp_contact_country_code: values.temp_contact_country_code,
          temp_contact_phone: values.temp_contact_phone,
          service_type: services.map(s => s.name).join(', '),
          status: 'pending',
          workflow_stage: 'submitted',
          service_price: totalServicePrice,
          inspection_price: inspectionPrice,
          tax_amount: taxAmount,
          completion_photos: images
        }])
        .select()
        .single();

      if (requestError) throw requestError;

      // يمكن إضافة خطوط الخدمة لاحقاً عندما يتوفر الجدول
      // const serviceLines = services.map(service => ({
      //   request_id: request.id,
      //   service_id: service.id,
      //   quantity: 1,
      //   unit_price: service.base_price,
      //   tax_rate: 0.14,
      //   total_amount: Number(service.base_price) * 1.14
      // }));

      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "سيتم التواصل معك قريباً",
      });

      navigate('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الطلب",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">الخدمات المحددة</h3>
            <div className="space-y-2 mb-6">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>{service.name}</span>
                  <span className="font-bold">{service.base_price} جنيه</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العقار (اختياري)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العقار" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map(prop => (
                          <SelectItem key={prop.id} value={prop.id}>
                            {prop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الطلب *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: صيانة كهرباء" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العميل *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" dir="ltr" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" dir="ltr" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ المفضل</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوقت المفضل</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>التفاصيل</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-4">
              <FormLabel>الصور المرفقة</FormLabel>
              <ImageUpload
                images={[]}
                onImagesChange={(files) => {
                  // سيتم تحميل الصور لاحقاً
                  console.log('Files selected:', files);
                }}
                maxImages={5}
              />
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-bold mb-4">بيانات التواصل المؤقتة (اختياري)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="temp_contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الشخص للتواصل</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temp_contact_country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز الدولة</FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temp_contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الجوال</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" dir="ltr" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowRight className="ml-2 h-4 w-4" />
            السابق
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            إرسال الطلب
          </Button>
        </div>
      </form>
    </Form>
  );
};
