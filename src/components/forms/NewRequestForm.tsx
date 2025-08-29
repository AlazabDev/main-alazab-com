import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, DollarSign, Loader2 } from "lucide-react";
// import { useMaintenanceRequests, NewRequestData } from "@/hooks/useMaintenanceRequests";

interface NewRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NewRequestForm({ onSuccess, onCancel }: NewRequestFormProps) {
  // const { createRequest } = useMaintenanceRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    phone: "",
    service_type: "general",
    priority: "medium",
    preferred_date: "",
    preferred_time: "",
    customer_notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // await createRequest(formData);
      setFormData({
        title: "",
        description: "",
        address: "",
        phone: "",
        service_type: "general",
        priority: "medium",
        preferred_date: "",
        preferred_time: "",
        customer_notes: ""
      });
      onSuccess?.();
    } catch (error) {
      // الخطأ تم التعامل معه في الـ hook
    } finally {
      setIsSubmitting(false);
    }
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
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان *</Label>
              <div className="relative">
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="العنوان التفصيلي"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
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