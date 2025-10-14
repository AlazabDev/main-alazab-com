import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PlatformSettings } from "@/components/settings/PlatformSettings";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { User, Building2, Key, CreditCard } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">إعدادات الحساب</h1>
      </div>
      
      <Tabs defaultValue="account" dir="rtl" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">إعدادات الحساب</span>
            <span className="md:hidden">الحساب</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden md:inline">إعدادات المنصة</span>
            <span className="md:hidden">المنصة</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden md:inline">إعدادات الخدمات</span>
            <span className="md:hidden">الخدمات</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">إعادة تعيين كلمة المرور</span>
            <span className="md:hidden">كلمة المرور</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">اشتراك النظام</span>
            <span className="md:hidden">الاشتراك</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="platform">
          <PlatformSettings />
        </TabsContent>

        <TabsContent value="services">
          <div className="text-center py-12 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">قريباً - إعدادات الخدمات</p>
          </div>
        </TabsContent>

        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}