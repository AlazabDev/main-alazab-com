import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  opening_hours?: string;
  geo?: any;
  created_by?: string;
  created_at: string;
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBranches([]);
        setLoading(false);
        return;
      }

      // الحصول على company_id للمستخدم
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        setBranches([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('name');

      if (error) throw error;
      setBranches(data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err as Error);
      toast({
        title: "خطأ في تحميل الفروع",
        description: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches
  };
};
