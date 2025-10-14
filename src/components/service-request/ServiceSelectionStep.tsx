import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";
import type { Service } from "@/hooks/useServices";

interface ServiceSelectionStepProps {
  categoryId: string | null;
  selectedServices: string[];
  onSelectService: (serviceId: string) => void;
  onNext: () => void;
}

export const ServiceSelectionStep = ({
  categoryId,
  selectedServices,
  onSelectService,
  onNext
}: ServiceSelectionStepProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setServices(filtered);
    } else {
      setServices(allServices);
    }
  }, [searchTerm, allServices]);

  const fetchServices = async () => {
    try {
      setLoading(true);
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
      setAllServices(data || []);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* قائمة الخدمات المحددة */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-4">التصنيفات الفرعية</h3>
            <div className="space-y-2">
              {services
                .filter(s => selectedServices.includes(s.id))
                .map(service => (
                  <div
                    key={service.id}
                    className="p-3 bg-primary/5 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.base_price} جنيه
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectService(service.id)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
            </div>
            {selectedServices.length > 0 && (
              <Button 
                className="w-full mt-4"
                onClick={onNext}
              >
                التالي ({selectedServices.length} خدمة)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* قائمة الخدمات */}
      <div className="lg:col-span-2">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الخدمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer hover:border-primary transition-colors ${
                selectedServices.includes(service.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelectService(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{service.name}</h4>
                      <Badge variant="secondary">
                        {service.base_price} جنيه
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{service.unit}</span>
                      {service.requires_inspection && (
                        <Badge variant="outline" className="text-xs">
                          يتطلب معاينة ({service.inspection_price} جنيه)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
