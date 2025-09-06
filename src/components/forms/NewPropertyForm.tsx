import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewPropertyFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const NewPropertyForm = ({ onClose, onSuccess }: NewPropertyFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    area: "",
    value: "",
    floors: "",
    rooms: "",
    bathrooms: "",
    parking_spaces: "",
    description: "",
    maintenance_schedule: ""
  });
  
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [lastInspectionDate, setLastInspectionDate] = useState<Date>();
  const [nextInspectionDate, setNextInspectionDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = [
    { value: "residential", label: "سكني" },
    { value: "commercial", label: "تجاري" },
    { value: "industrial", label: "صناعي" },
    { value: "office", label: "مكتبي" },
    { value: "retail", label: "تجزئة" },
    { value: "mixed_use", label: "مختلط الاستخدام" }
  ];

  const commonAmenities = [
    "مصعد", "حارس أمن", "مواقف سيارات", "حديقة", "مسبح", 
    "صالة رياضة", "غرفة اجتماعات", "مكيف هواء مركزي", "انترنت"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAmenity = (amenity?: string) => {
    const amenityToAdd = amenity || newAmenity.trim();
    if (amenityToAdd && !amenities.includes(amenityToAdd)) {
      setAmenities(prev => [...prev, amenityToAdd]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(prev => prev.filter(a => a !== amenity));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.address) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const propertyData = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        status: 'active',
        area: formData.area ? parseFloat(formData.area) : null,
        value: formData.value ? parseFloat(formData.value) : null,
        floors: formData.floors ? parseInt(formData.floors) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        parking_spaces: formData.parking_spaces ? parseInt(formData.parking_spaces) : null,
        description: formData.description || null,
        amenities: amenities.length > 0 ? amenities : null,
        maintenance_schedule: formData.maintenance_schedule || null,
        last_inspection_date: lastInspectionDate?.toISOString().split('T')[0] || null,
        next_inspection_date: nextInspectionDate?.toISOString().split('T')[0] || null
      };

      console.log('Submitting property data:', propertyData);
      
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Property added successfully:', data);

      toast({
        title: "تم بنجاح",
        description: "تم إضافة العقار الجديد بنجاح"
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ في إضافة العقار",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">إضافة عقار جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">اسم العقار *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="اسم العقار"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">نوع العقار *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">العنوان *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="العنوان الكامل"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">المساحة (متر مربع)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
                placeholder="المساحة"
              />
            </div>
            <div>
              <Label htmlFor="value">القيمة (جنيه مصري)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                placeholder="قيمة العقار"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="floors">عدد الطوابق</Label>
              <Input
                id="floors"
                type="number"
                value={formData.floors}
                onChange={(e) => handleInputChange("floors", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="rooms">عدد الغرف</Label>
              <Input
                id="rooms"
                type="number"
                value={formData.rooms}
                onChange={(e) => handleInputChange("rooms", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">عدد الحمامات</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="parking_spaces">مواقف السيارات</Label>
              <Input
                id="parking_spaces"
                type="number"
                value={formData.parking_spaces}
                onChange={(e) => handleInputChange("parking_spaces", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label>المرافق والخدمات</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={amenities.includes(amenity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => amenities.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="أضف مرفق آخر"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={() => addAmenity()} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {amenities.filter(a => !commonAmenities.includes(a)).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="px-2 py-1">
                  {amenity}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeAmenity(amenity)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>تاريخ آخر تفتيش</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !lastInspectionDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {lastInspectionDate ? format(lastInspectionDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={lastInspectionDate}
                    onSelect={setLastInspectionDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>تاريخ التفتيش القادم</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !nextInspectionDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {nextInspectionDate ? format(nextInspectionDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={nextInspectionDate}
                    onSelect={setNextInspectionDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="maintenance_schedule">جدولة الصيانة</Label>
            <Input
              id="maintenance_schedule"
              value={formData.maintenance_schedule}
              onChange={(e) => handleInputChange("maintenance_schedule", e.target.value)}
              placeholder="مثال: شهرياً، ربع سنوي، سنوياً"
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="وصف تفصيلي للعقار"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "جاري الإضافة..." : "إضافة العقار"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};