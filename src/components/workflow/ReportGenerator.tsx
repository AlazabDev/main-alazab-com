import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Download, Send } from "lucide-react";

interface ReportGeneratorProps {
  requestId: string;
  requestData?: any;
}

export function ReportGenerator({ requestId, requestData }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'progress' | 'engineering' | 'final' | 'accounting'>('progress');
  const [title, setTitle] = useState('');
  const [contentData, setContentData] = useState({
    summary: '',
    findings: '',
    recommendations: '',
    materials_used: '',
    labor_units: '',
    total_cost: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('maintenance_reports')
        .insert({
          request_id: requestId,
          report_type: reportType,
          title,
          content: contentData,
          data_analysis: {
            request_details: requestData,
            generated_at: new Date().toISOString()
          },
          prepared_by: userData.user.id,
          status: 'draft'
        });

      if (error) throw error;

      toast.success('تم إنشاء التقرير بنجاح');
      
      // Reset form
      setTitle('');
      setContentData({
        summary: '',
        findings: '',
        recommendations: '',
        materials_used: '',
        labor_units: '',
        total_cost: ''
      });
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('حدث خطأ أثناء إنشاء التقرير');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportTypeLabels = {
    progress: 'تقرير التقدم',
    engineering: 'تقرير هندسي',
    final: 'التقرير النهائي',
    accounting: 'تقرير الحسابات'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          إنشاء تقرير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>نوع التقرير</Label>
            <Select
              value={reportType}
              onValueChange={(value: any) => setReportType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">تقرير التقدم</SelectItem>
                <SelectItem value="engineering">تقرير هندسي</SelectItem>
                <SelectItem value="final">التقرير النهائي</SelectItem>
                <SelectItem value="accounting">تقرير الحسابات</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>عنوان التقرير *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تقرير التقدم الأسبوعي"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>الملخص *</Label>
            <Textarea
              value={contentData.summary}
              onChange={(e) => setContentData({ ...contentData, summary: e.target.value })}
              placeholder="ملخص عام عن التقرير..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>النتائج والملاحظات</Label>
              <Textarea
                value={contentData.findings}
                onChange={(e) => setContentData({ ...contentData, findings: e.target.value })}
                placeholder="النتائج المستخلصة..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>التوصيات</Label>
              <Textarea
                value={contentData.recommendations}
                onChange={(e) => setContentData({ ...contentData, recommendations: e.target.value })}
                placeholder="التوصيات والإجراءات المقترحة..."
                rows={3}
              />
            </div>
          </div>

          {(reportType === 'engineering' || reportType === 'accounting') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>المواد المستخدمة</Label>
                <Input
                  value={contentData.materials_used}
                  onChange={(e) => setContentData({ ...contentData, materials_used: e.target.value })}
                  placeholder="تفاصيل المواد..."
                />
              </div>

              <div className="space-y-2">
                <Label>عدد الوحدات</Label>
                <Input
                  type="number"
                  value={contentData.labor_units}
                  onChange={(e) => setContentData({ ...contentData, labor_units: e.target.value })}
                  placeholder="عدد الوحدات"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <Label>التكلفة الإجمالية</Label>
                <Input
                  type="number"
                  value={contentData.total_cost}
                  onChange={(e) => setContentData({ ...contentData, total_cost: e.target.value })}
                  placeholder="التكلفة"
                  step="0.01"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'جاري الإرسال...' : 'إنشاء التقرير'}
            </Button>
            <Button type="button" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير PDF
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}