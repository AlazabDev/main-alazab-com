import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('admin@azab.services');
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام إدارة الصيانة",
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تأكد من البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">azab.services</CardTitle>
          <p className="text-muted-foreground">نظام إدارة طلبات الصيانة</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@azab.services"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              تسجيل الدخول
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              بيانات تجريبية:<br />
              <strong>البريد:</strong> admin@azab.services<br />
              <strong>كلمة المرور:</strong> admin123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}