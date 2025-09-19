
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { DollarSign, Download, Plus, FileText, Eye } from "lucide-react";
import { NewInvoiceForm } from "@/components/forms/NewInvoiceForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Invoice = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  due_date?: string;
  issue_date: string;
  status: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الفواتير",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleInvoiceCreated = () => {
    setIsDialogOpen(false);
    fetchInvoices();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوعة';
      case 'pending':
        return 'معلقة';
      case 'overdue':
        return 'متأخرة';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">الفواتير</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إنشاء فاتورة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <NewInvoiceForm 
                    onSuccess={handleInvoiceCreated}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <p>جاري تحميل الفواتير...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد فواتير حتى الآن</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="card-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {invoice.invoice_number}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                          <p className="text-sm text-muted-foreground">العميل</p>
                          <p className="font-semibold">{invoice.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">المبلغ</p>
                          <p className="font-semibold flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {invoice.amount.toFixed(2)} {invoice.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">التاريخ</p>
                          <p className="font-semibold">
                            {new Date(invoice.issue_date).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الحالة</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-3 w-3" />
                            تحميل
                          </Button>
                        </div>
                      </div>
                      {invoice.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">ملاحظات:</p>
                          <p className="text-sm">{invoice.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
    </div>
  );
}