import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Plus, Trash2 } from "lucide-react";

interface MaterialItem {
  material_name: string;
  quantity: number;
  unit: string;
  estimated_cost: number;
  notes: string;
}

interface MaterialRequestFormProps {
  requestId: string;
  onSuccess?: () => void;
}

export function MaterialRequestForm({ requestId, onSuccess }: MaterialRequestFormProps) {
  const [items, setItems] = useState<MaterialItem[]>([
    { material_name: '', quantity: 1, unit: '', estimated_cost: 0, notes: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { material_name: '', quantity: 1, unit: '', estimated_cost: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof MaterialItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate items
      const validItems = items.filter(item => item.material_name.trim());
      if (validItems.length === 0) {
        toast.error('يجب إضافة مادة واحدة على الأقل');
        return;
      }

      // Insert material requests
      const { error } = await supabase
        .from('material_requests')
        .insert(
          validItems.map(item => ({
            request_id: requestId,
            ...item
          }))
        );

      if (error) throw error;

      toast.success('تم إضافة طلب المواد بنجاح');
      setItems([{ material_name: '', quantity: 1, unit: '', estimated_cost: 0, notes: '' }]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating material request:', error);
      toast.error('حدث خطأ أثناء إضافة طلب المواد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          طلب المواد والأذون المخزنية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">مادة #{index + 1}</h4>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>اسم المادة *</Label>
                  <Input
                    value={item.material_name}
                    onChange={(e) => updateItem(index, 'material_name', e.target.value)}
                    placeholder="مثال: مواد كهربائية"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>الكمية *</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>الوحدة *</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(value) => updateItem(index, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">قطعة</SelectItem>
                      <SelectItem value="meter">متر</SelectItem>
                      <SelectItem value="liter">لتر</SelectItem>
                      <SelectItem value="kg">كيلوجرام</SelectItem>
                      <SelectItem value="box">صندوق</SelectItem>
                      <SelectItem value="pack">حزمة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>التكلفة المقدرة</Label>
                  <Input
                    type="number"
                    value={item.estimated_cost}
                    onChange={(e) => updateItem(index, 'estimated_cost', Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={item.notes}
                  onChange={(e) => updateItem(index, 'notes', e.target.value)}
                  placeholder="ملاحظات إضافية حول المادة..."
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مادة أخرى
            </Button>
            <Button type="submit" disabled={isSubmitting} className="mr-auto">
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}