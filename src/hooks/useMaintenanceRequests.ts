import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type WorkflowStage = 
  | 'draft'
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'inspection'
  | 'waiting_parts'
  | 'completed'
  | 'billed'
  | 'paid'
  | 'closed'
  | 'cancelled'
  | 'on_hold';

// Based on actual database schema
export interface MaintenanceRequest {
  id: string;
  company_id: string;
  branch_id: string;
  asset_id?: string;
  category_id?: string;
  subcategory_id?: string;
  opened_by_role?: string;
  channel?: string;
  title: string;
  description?: string;
  priority?: string;
  sla_deadline?: string;
  status: string;
  created_at: string;
  created_by?: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  location?: string;
  service_type?: string;
  estimated_cost?: number;
  actual_cost?: number;
  rating?: number;
  workflow_stage?: string;
  sla_due_date?: string;
  assigned_vendor_id?: string;
  vendor_notes?: string;
  archived_at?: string;
  updated_at?: string;
}

export function useMaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // جرب الجدول الجديد أولاً
      let data, error;
      
      const result = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      // إذا نجح، استخدمه
      if (!result.error) {
        const fullResult = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });
        data = fullResult.data;
        error = fullResult.error;
      } else {
        // وإلا، لا توجد بيانات
        data = [];
        error = null;
      }

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err as Error);
      toast({
        title: "خطأ في تحميل الطلبات",
        description: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }
      
      // الحصول على company_id و branch_id من ملف المستخدم
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      // إذا لم يكن للمستخدم company_id، نستخدم قيمة افتراضية
      let company_id = profile?.company_id;
      if (!company_id) {
        // إنشاء company جديدة للمستخدم
        const { data: newCompany } = await supabase
          .from('companies')
          .insert({ 
            name: 'شركة افتراضية',
            created_by: user.id 
          })
          .select('id')
          .single();
        
        if (newCompany) {
          company_id = newCompany.id;
          // تحديث profile المستخدم
          await supabase
            .from('profiles')
            .update({ company_id: newCompany.id })
            .eq('id', user.id);
        }
      }
      
      // الحصول على أول فرع أو إنشاء فرع جديد
      let { data: branches } = await supabase
        .from('branches')
        .select('id')
        .eq('company_id', company_id)
        .limit(1);
      
      let branch_id = branches?.[0]?.id;
      if (!branch_id && company_id) {
        const { data: newBranch } = await supabase
          .from('branches')
          .insert({
            company_id: company_id,
            name: 'الفرع الرئيسي',
            created_by: user.id
          })
          .select('id')
          .single();
        
        if (newBranch) {
          branch_id = newBranch.id;
        }
      }
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...requestData,
          created_by: user.id,
          status: 'Open',
          company_id: company_id,
          branch_id: branch_id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✓ تم إنشاء الطلب",
        description: "تم إنشاء طلب الصيانة بنجاح",
      });

      await fetchRequests();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "فشل في إنشاء طلب الصيانة";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✓ تم التحديث",
        description: "تم تحديث طلب الصيانة بنجاح",
      });

      await fetchRequests();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "فشل في تحديث طلب الصيانة";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "✓ تم الحذف",
        description: "تم حذف طلب الصيانة بنجاح",
      });

      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "فشل في حذف طلب الصيانة";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
    deleteRequest,
    refetch: fetchRequests
  };
}