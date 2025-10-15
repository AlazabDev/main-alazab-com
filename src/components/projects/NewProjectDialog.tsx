import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

interface NewProjectDialogProps {
  onSuccess?: () => void;
}

export function NewProjectDialog({ onSuccess }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    client_name: "",
    location: "",
    project_type: "",
    status: "planning",
    budget: "",
    start_date: "",
    end_date: "",
    magicplan_iframe_url: "",
    cover_image_url: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("projects").insert({
        name: formData.name,
        code: formData.code || null,
        description: formData.description || null,
        client_name: formData.client_name,
        location: formData.location,
        project_type: formData.project_type || null,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        magicplan_iframe_url: formData.magicplan_iframe_url || null,
        cover_image_url: formData.cover_image_url || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      if (error) throw error;

      toast({
        title: "تم إنشاء المشروع بنجاح",
        description: "تم إضافة المشروع إلى القائمة",
      });

      setOpen(false);
      setFormData({
        name: "",
        code: "",
        description: "",
        client_name: "",
        location: "",
        project_type: "",
        status: "planning",
        budget: "",
        start_date: "",
        end_date: "",
        magicplan_iframe_url: "",
        cover_image_url: "",
        latitude: "",
        longitude: "",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء المشروع",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مشروع جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المشروع *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">الكود الداخلي</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">اسم العميل *</Label>
              <Input
                id="client_name"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">الموقع *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_type">نوع المشروع</Label>
              <Input
                id="project_type"
                placeholder="سكني، تجاري، إداري..."
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">التخطيط</SelectItem>
                  <SelectItem value="design">التصميم</SelectItem>
                  <SelectItem value="licensing">الترخيص</SelectItem>
                  <SelectItem value="construction">التنفيذ</SelectItem>
                  <SelectItem value="finishing">التشطيب</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="maintenance">صيانة دورية</SelectItem>
                  <SelectItem value="on_hold">معلق</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية (جنيه)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ النهاية</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="magicplan_iframe_url">رابط Magicplan</Label>
            <Input
              id="magicplan_iframe_url"
              placeholder="https://..."
              value={formData.magicplan_iframe_url}
              onChange={(e) => setFormData({ ...formData, magicplan_iframe_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">رابط الصورة الرئيسية</Label>
            <Input
              id="cover_image_url"
              placeholder="https://..."
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">خط العرض</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="30.0444"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">خط الطول</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="31.2357"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ المشروع
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
