import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  service_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_by?: string;
  assigned_to?: string;
  store_id?: string;
  phone?: string;
  address?: string;
  preferred_date?: string;
  preferred_time?: string;
  urgency_level?: 'low' | 'medium' | 'high' | 'urgent';
  customer_notes?: string;
  vendor_notes?: string;
  cost?: number;
  estimated_completion?: string;
  actual_completion?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface NewRequestData {
  title: string;
  description: string;
  service_type: 'plumbing' | 'electrical' | 'hvac' | 'carpentry' | 'cleaning' | 'painting' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  phone: string;
  address: string;
  preferred_date?: string;
  preferred_time?: string;
  customer_notes?: string;
}

export function useMaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // جلب جميع الطلبات
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "خطأ في جلب البيانات",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // إنشاء طلب جديد
  const createRequest = async (requestData: NewRequestData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...requestData,
          requested_by: user.id,
          status: 'pending',
          urgency_level: requestData.priority,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "سيتم مراجعة طلبك والرد عليك قريباً",
      });

      fetchRequests(); // إعادة جلب القائمة
      return data;
    } catch (err: any) {
      toast({
        title: "خطأ في إنشاء الطلب",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // تحديث حالة الطلب
  const updateRequestStatus = async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold', notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');

      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status,
          vendor_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // إضافة سجل في تاريخ الحالة
      await supabase
        .from('request_status_history')
        .insert({
          request_id: requestId,
          new_status: status,
          changed_by: user.id,
          notes
        });

      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة الطلب بنجاح",
      });

      fetchRequests();
    } catch (err: any) {
      toast({
        title: "خطأ في تحديث الحالة",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // تعيين مورد للطلب
  const assignVendor = async (requestId: string, vendorId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          assigned_to: vendorId,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "تم تعيين المورد",
        description: "تم تعيين المورد للطلب بنجاح",
      });

      fetchRequests();
    } catch (err: any) {
      toast({
        title: "خطأ في تعيين المورد",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // تقييم الخدمة
  const rateService = async (requestId: string, rating: number, notes?: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          rating,
          customer_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "تم إضافة التقييم",
        description: "شكراً لك على تقييم الخدمة",
      });

      fetchRequests();
    } catch (err: any) {
      toast({
        title: "خطأ في إضافة التقييم",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // الاستماع للتحديثات في الوقت الفعلي
  useEffect(() => {
    fetchRequests();

    // الاستماع للتغييرات في الوقت الفعلي
    const channel = supabase
      .channel('maintenance_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequestStatus,
    assignVendor,
    rateService,
    refreshRequests: fetchRequests
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('request_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('request_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('request_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // الاستماع للإشعارات الجديدة
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'request_notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
}