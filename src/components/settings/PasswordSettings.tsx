import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string()
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)")
    .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل (0-9)")
    .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل (*&%$#@!)"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordSettings = () => {
  const { updatePassword } = useUserSettings();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    updatePassword({ newPassword: values.newPassword });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور القديمة</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="كلمة المرور القديمة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="كلمة المرور الجديدة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="تأكيد كلمة المرور الجديدة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium">متطلبات كلمة المرور:</p>
              <ul className="text-sm text-muted-foreground space-y-1 mr-4 list-disc">
                <li>8 أحرف على الأقل</li>
                <li>حرف كبير واحد على الأقل (A-Z)</li>
                <li>حرف صغير واحد على الأقل (a-z)</li>
                <li>رقم واحد على الأقل (0-9)</li>
                <li>رمز خاص واحد على الأقل (*&%$#@!)</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">حفظ</Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
