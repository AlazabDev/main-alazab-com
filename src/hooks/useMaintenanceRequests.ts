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

export interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  location: string;
  address?: string;
  phone?: string;
  service_type: string;
  status: string;
  priority: string;
  preferred_date?: string;
  preferred_time?: string;
  customer_notes?: string;
  vendor_notes?: string;
  estimated_cost?: number;
  actual_cost?: number;
  rating?: number;
  completion_photos?: string[];
  created_at: string;
  updated_at: string;
  requested_by?: string;
  assigned_vendor_id?: string;
  estimated_completion?: string;
  actual_completion?: string;
  // New lifecycle fields
  workflow_stage?: WorkflowStage;
  sla_due_date?: string;
  escalation_level?: number;
  quality_score?: number;
  follow_up_required?: boolean;
  follow_up_date?: string;
  archived_at?: string;
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

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });

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
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...requestData,
          requested_by: user.id,
          status: 'pending',
          workflow_stage: 'submitted'
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