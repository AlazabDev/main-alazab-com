import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  base_price: number;
  unit: string;
  is_active: boolean;
  requires_inspection?: boolean;
  inspection_price?: number;
  estimated_duration?: number;
  icon?: string;
  image_url?: string;
  sort_order: number;
}

export const useServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل التصنيفات');
    }
  };

  const fetchServices = async (categoryId?: string) => {
    try {
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل الخدمات');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchServices()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    categories,
    services,
    loading,
    error,
    fetchServices,
    refetch: () => Promise.all([fetchCategories(), fetchServices()])
  };
};
