import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptIcon } from "lucide-react";

export const SubscriptionSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>اشتراك النظام</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="features" dir="rtl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">الميزات المتاحة</TabsTrigger>
            <TabsTrigger value="subscriptions">الاشتراكات & الفواتير</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا يوجد ميزات متاحة حالياً</p>
            </div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="space-y-6">
            {/* Subscriptions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">سجل الاشتراكات</h3>
              <div className="text-center py-8 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">لا يوجد عناصر.</p>
              </div>
            </div>

            {/* Invoices */}
            <div>
              <h3 className="text-lg font-semibold mb-4">الفواتير</h3>
              <div className="text-center py-8 border rounded-lg bg-muted/50">
                <ReceiptIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">لا يوجد عناصر.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
