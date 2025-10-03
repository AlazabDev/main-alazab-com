import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Phone, Loader2 } from "lucide-react";
import { useMaintenanceRequests } from "@/hooks/useMaintenanceRequests";
import { useToast } from "@/hooks/use-toast";
import { LocationPicker } from "@/components/forms/LocationPicker";
import { supabase } from "@/integrations/supabase/client";
import { useRequestLifecycle } from "@/hooks/useRequestLifecycle";

interface NewRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NewRequestForm({ onSuccess, onCancel }: NewRequestFormProps) {
  const { createRequest } = useMaintenanceRequests();
  const { addLifecycleEvent } = useRequestLifecycle();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_name: "",
    client_phone: "",
    location: "",
    service_type: "general",
    priority: "medium",
    preferred_date: "",
    preferred_time: "",
    customer_notes: "",
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await createRequest(formData);
      if (result) {
        // إنشاء حدث دورة حياة للطلب الجديد
        try {
          await addLifecycleEvent(
            result.id,
            'submitted',
            'status_change',
            'تم إنشاء الطلب بنجاح',
            { 
              service_type: formData.service_type,
              priority: formData.priority,
              has_location: !!(formData.latitude && formData.longitude)
            }
          );

          // إنشاء إشعار للمستخدم
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('notifications').insert({
              recipient_id: user.id,
              title: 'تم استلام طلبك',
              message: `تم استلام طلب الصيانة: ${formData.title}`,
              type: 'success',
              entity_type: 'maintenance_request',
              entity_id: result.id
            });
          }
        } catch (lifecycleError) {
          console.error('Error creating lifecycle event:', lifecycleError);
        }

        toast({
          title: "تم إرسال الطلب بنجاح",
          description: "سيتم التواصل معك قريباً",
        });

        // إرسال إشعار لأقرب فني إذا تم تحديد الموقع
        if (formData.latitude && formData.longitude) {
          try {
            const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('send-notification', {
              body: {
                maintenanceRequestId: result.id,
                latitude: formData.latitude,
                longitude: formData.longitude,
                serviceType: formData.service_type,
                clientName: formData.client_name,
                address: formData.location
              }
            });

            if (notificationError) {
              console.error('Notification error:', notificationError);
              toast({
                title: "تحذير",
                description: "تم إنشاء الطلب لكن فشل في إرسال الإشعارات للفنيين",
                variant: "destructive",
              });
            } else if (notificationResult?.vendor) {
              toast({
                title: "تم تعيين فني",
                description: `تم تعيين ${notificationResult.vendor.name} للطلب (${notificationResult.vendor.distance?.toFixed(1)} كم)`,
              });
            }
          } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
            toast({
              title: "تحذير", 
              description: "تم إنشاء الطلب لكن لا يوجد فنيين متاحين في المنطقة",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "ملاحظة",
            description: "لم يتم تحديد موقع - سيتم تعيين فني يدوياً",
          });
        }

        setFormData({
          title: "",
          description: "",
          client_name: "",
          client_phone: "",
          location: "",
          service_type: "general",
          priority: "medium",
          preferred_date: "",
          preferred_time: "",
          customer_notes: "",
          latitude: null,
          longitude: null
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: address || prev.location
    }));
    setShowLocationPicker(false);
    toast({
      title: "تم تحديد الموقع",
      description: "تم حفظ موقعك بنجاح",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">طلب صيانة جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الطلب *</Label>
              <Input
                id="title"
                placeholder="مثال: إصلاح تسريب المياه"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="01xxxxxxxxx"
                  value={formData.client_phone}
                  onChange={(e) => handleChange("client_phone", e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">اسم العميل *</Label>
              <Input
                id="client_name"
                placeholder="اسم العميل"
                value={formData.client_name}
                onChange={(e) => handleChange("client_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">العنوان *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="العنوان التفصيلي"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
              <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>تحديد الموقع على الخريطة</DialogTitle>
                  </DialogHeader>
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                    initialLatitude={formData.latitude || undefined}
                    initialLongitude={formData.longitude || undefined}
                    initialAddress={formData.location}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-green-600">
                ✓ تم تحديد الموقع على الخريطة
              </p>
            )}
          </div>


          {/* Service Details */}
          <div className="space-y-2">
            <Label htmlFor="service_type">نوع الخدمة *</Label>
            <Select value={formData.service_type} onValueChange={(value) => handleChange("service_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">سباكة</SelectItem>
                <SelectItem value="electrical">كهرباء</SelectItem>
                <SelectItem value="hvac">تكييف</SelectItem>
                <SelectItem value="carpentry">نجارة</SelectItem>
                <SelectItem value="painting">دهانات</SelectItem>
                <SelectItem value="cleaning">تنظيف</SelectItem>
                <SelectItem value="general">صيانة عامة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المشكلة *</Label>
            <Textarea
              id="description"
              placeholder="اشرح التفاصيل والمشكلة بوضوح..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Priority & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">الأولوية</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_date">التاريخ المفضل</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => handleChange("preferred_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_time">الوقت المفضل</Label>
              <Select value={formData.preferred_time} onValueChange={(value) => handleChange("preferred_time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">صباحاً (8-12)</SelectItem>
                  <SelectItem value="afternoon">ظهراً (12-4)</SelectItem>
                  <SelectItem value="evening">مساءً (4-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_notes">ملاحظات إضافية</Label>
            <Textarea
              id="customer_notes"
              placeholder="أي معلومات إضافية تساعد في تنفيذ المهمة..."
              value={formData.customer_notes}
              onChange={(e) => handleChange("customer_notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority Badge Preview */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">معاينة الأولوية:</span>
            <Badge className={
              formData.priority === "high" ? "bg-destructive text-destructive-foreground" :
              formData.priority === "medium" ? "bg-warning text-warning-foreground" :
              "bg-muted text-muted-foreground"
            }>
              {formData.priority === "high" ? "عالية" : 
               formData.priority === "medium" ? "متوسطة" : "منخفضة"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              إرسال الطلب
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}