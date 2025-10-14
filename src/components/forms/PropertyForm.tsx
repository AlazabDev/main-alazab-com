import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "./LocationPicker";
import { ImageUpload } from "./ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const propertySchema = z.object({
  name: z.string().min(3, "اسم العقار يجب أن يكون 3 أحرف على الأقل"),
  type: z.enum(["residential", "commercial", "administrative"], {
    required_error: "يرجى اختيار نوع العقار",
  }),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  area: z.number().min(1, "المساحة يجب أن تكون أكبر من 0"),
  rooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parking_spaces: z.number().min(0).optional(),
  floors: z.number().min(0).optional(),
  description: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export function PropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const propertyType = watch("type");

  const onSubmit = async (data: PropertyFormData) => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى تحديد موقع العقار على الخريطة",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      // رفع الصور أولاً
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${Date.now()}_${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("az_gallery")
          .upload(`properties/${fileName}`, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("az_gallery")
          .getPublicUrl(uploadData.path);

        imageUrls.push(publicUrl);
      }

      // إنشاء العقار
      const { error: insertError } = await supabase
        .from("properties")
        .insert({
          name: data.name,
          type: data.type,
          address: data.address,
          area: data.area,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          parking_spaces: data.parking_spaces,
          floors: data.floors,
          description: data.description,
          // TODO: إضافة حقول latitude و longitude للجدول
          status: "active",
          manager_id: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "تم بنجاح",
        description: "تم إضافة العقار بنجاح",
      });

      navigate("/properties");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة العقار",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({ latitude: lat, longitude: lng, address });
    setValue("address", address);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* تصنيف العقار */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">تصنيف العقار *</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { value: "residential", label: "السكني" },
            { value: "commercial", label: "التجاري" },
            { value: "administrative", label: "الإداري" },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setValue("type", type.value as any)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                propertyType === type.value
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* اسم/رقم العقار */}
      <div className="space-y-2">
        <Label htmlFor="name">اسم/رقم العقار *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="مثال: عمارة أكتوبر"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* صورة العقار */}
      <div className="space-y-2">
        <Label>صورة العقار</Label>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={5}
        />
      </div>

      {/* تفاصيل الموقع */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">تفاصيل الموقع</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>الدولة</Label>
            <Select defaultValue="EG">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EG">جمهورية مصر العربية</SelectItem>
                <SelectItem value="SA">المملكة العربية السعودية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>المدينة</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة التي يقع بها العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6october">6 أكتوبر</SelectItem>
                <SelectItem value="cairo">القاهرة</SelectItem>
                <SelectItem value="giza">الجيزة</SelectItem>
                <SelectItem value="alex">الإسكندرية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>الحي</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحي الذي يقع به العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">الحي الأول</SelectItem>
                <SelectItem value="2">الحي الثاني</SelectItem>
                <SelectItem value="3">الحي الثالث</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* إحداثيات الخريطة */}
      <div className="space-y-2">
        <Label>إحداثيات الخريطة</Label>
        <div className="text-sm text-muted-foreground mb-2">
          نادي وادي دجلة 1 أكتوبر، 6 أكتوبر، محافظة الجيزة EG
          <br />
          من نحن نقدم خدمات صيانة شاملة: نجارة، سباكة، كهرباء، بناء، ترميم، تشطيب.
        </div>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLatitude={location?.latitude}
          initialLongitude={location?.longitude}
          initialAddress={location?.address}
        />
      </div>

      {/* العنوان التفصيلي */}
      <div className="space-y-2">
        <Label htmlFor="address">العنوان التفصيلي</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="نادي وادي دجلة أكتوبر"
          rows={3}
          className={errors.address ? "border-destructive" : ""}
        />
        <p className="text-xs text-muted-foreground">
          تفاصيل إضافية للعنوان: مثل رقم الطابق، الطريق بعد الرقم الأساسي، رقم الشقة، إلخ
        </p>
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* إعدادات العقار */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">إعدادات العقار</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">المساحة (متر مربع) *</Label>
            <Input
              id="area"
              type="number"
              {...register("area", { valueAsNumber: true })}
              placeholder="مثال: 150"
              className={errors.area ? "border-destructive" : ""}
            />
            {errors.area && (
              <p className="text-sm text-destructive">{errors.area.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rooms">عدد الغرف</Label>
            <Input
              id="rooms"
              type="number"
              {...register("rooms", { valueAsNumber: true })}
              placeholder="مثال: 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">عدد الحمامات</Label>
            <Input
              id="bathrooms"
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
              placeholder="مثال: 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parking">مواقف السيارات</Label>
            <Input
              id="parking"
              type="number"
              {...register("parking_spaces", { valueAsNumber: true })}
              placeholder="مثال: 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floors">عدد الطوابق</Label>
            <Input
              id="floors"
              type="number"
              {...register("floors", { valueAsNumber: true })}
              placeholder="مثال: 2"
            />
          </div>
        </div>
      </div>

      {/* الوصف */}
      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="أدخل وصفاً تفصيلياً للعقار..."
          rows={4}
        />
      </div>

      {/* أزرار الحفظ */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/properties")}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ البيانات"
          )}
        </Button>
      </div>
    </form>
  );
}
