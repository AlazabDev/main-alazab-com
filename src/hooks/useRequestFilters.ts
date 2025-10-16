import { useState, useMemo } from 'react';
import { MaintenanceRequest } from './useMaintenanceRequests';

export interface RequestFilters {
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  serviceTypeFilter: string;
  locationFilter: string;
  dateFrom?: Date;
  dateTo?: Date;
  minCost: string;
  maxCost: string;
  ratingFilter: string;
}

export function useRequestFilters(requests: MaintenanceRequest[]) {
  const [filters, setFilters] = useState<RequestFilters>({
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    serviceTypeFilter: 'all',
    locationFilter: '',
    minCost: '',
    maxCost: '',
    ratingFilter: 'all'
  });

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // البحث النصي
      const matchesSearch = !filters.searchTerm || 
        request.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        request.client_name?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // تصفية الحالة
      const matchesStatus = filters.statusFilter === 'all' || 
        request.status === filters.statusFilter ||
        request.workflow_stage === filters.statusFilter;
      
      // تصفية الأولوية
      const matchesPriority = filters.priorityFilter === 'all' || 
        request.priority === filters.priorityFilter;
      
      // تصفية نوع الخدمة
      const matchesServiceType = filters.serviceTypeFilter === 'all' || 
        request.service_type === filters.serviceTypeFilter;
      
      // تصفية الموقع
      const matchesLocation = !filters.locationFilter || 
        request.location?.toLowerCase().includes(filters.locationFilter.toLowerCase());
      
      // تصفية التاريخ
      const requestDate = new Date(request.created_at);
      const matchesDateFrom = !filters.dateFrom || requestDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || requestDate <= filters.dateTo;
      
      // تصفية التكلفة
      const cost = request.actual_cost || request.estimated_cost || 0;
      const matchesMinCost = !filters.minCost || cost >= parseFloat(filters.minCost);
      const matchesMaxCost = !filters.maxCost || cost <= parseFloat(filters.maxCost);
      
      // تصفية التقييم
      const matchesRating = filters.ratingFilter === 'all' || 
        !request.rating || 
        request.rating >= parseInt(filters.ratingFilter);
      
      return matchesSearch && matchesStatus && matchesPriority && 
        matchesServiceType && matchesLocation && matchesDateFrom && 
        matchesDateTo && matchesMinCost && matchesMaxCost && matchesRating;
    });
  }, [requests, filters]);

  const updateFilter = <K extends keyof RequestFilters>(
    key: K, 
    value: RequestFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      priorityFilter: 'all',
      serviceTypeFilter: 'all',
      locationFilter: '',
      minCost: '',
      maxCost: '',
      ratingFilter: 'all'
    });
  };

  return {
    filters,
    filteredRequests,
    updateFilter,
    clearFilters
  };
}
