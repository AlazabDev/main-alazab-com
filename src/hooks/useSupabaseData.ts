import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMaintenanceRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return { requests, loading, error };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

export const useStats = () => {
  const { requests } = useMaintenanceRequests();
  const { projects } = useProjects();

  const stats = {
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    todayRequests: requests.filter(r => {
      const today = new Date().toDateString();
      return new Date(r.created_at).toDateString() === today;
    }).length,
    completedRequests: requests.filter(r => r.status === 'completed').length,
    totalRequests: requests.length,
    thisMonthRequests: requests.filter(r => {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const requestDate = new Date(r.created_at);
      return requestDate.getMonth() === thisMonth && requestDate.getFullYear() === thisYear;
    }).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    actualCost: projects.reduce((sum, p) => sum + p.actual_cost, 0),
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
  };

  return stats;
};