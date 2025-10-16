import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const accountSchema = z.object({
  first_name: z.string().min(1, "الاسم مطلوب"),
  last_name: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  birth_date: z.string().optional(),
  timezone: z.string().default("Africa/Cairo"),
  phone: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export const AccountSettings = () => {
  const { profile, preferences, updateProfile, updatePreferences } = useUserSettings();
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notifications_enabled ?? true);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      gender: (profile?.gender as "male" | "female") || undefined,
      birth_date: profile?.birth_date || "",
      timezone: profile?.timezone || "Africa/Cairo",
      phone: profile?.phone || "",
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    updateProfile(values);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    updatePreferences({ notifications_enabled: enabled });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>البيانات الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالكامل *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل الاسم" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الجنس</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+20 123 456 7890" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاريخ الميلاد</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المنطقة الزمنية</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Africa/Cairo">Africa - Cairo</SelectItem>
                          <SelectItem value="Asia/Riyadh">Asia - Riyadh</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia - Dubai</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Label>استقبال الإشعارات</Label>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationsChange}
                  />
                </div>
                <Button type="submit">حفظ</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
