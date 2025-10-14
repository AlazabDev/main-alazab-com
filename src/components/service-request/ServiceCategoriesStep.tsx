import { Card, CardContent } from "@/components/ui/card";
import { useServices } from "@/hooks/useServices";
import { Loader2 } from "lucide-react";

interface ServiceCategoriesStepProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const ServiceCategoriesStep = ({
  selectedCategory,
  onSelectCategory
}: ServiceCategoriesStepProps) => {
  const { categories, loading } = useServices();

  // فلترة التصنيفات الرئيسية فقط (التي ليس لها parent)
  const mainCategories = categories.filter(cat => !cat.parent_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">التصنيفات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mainCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer hover:border-primary transition-colors ${
              selectedCategory === category.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {category.icon && (
                  <div className="text-4xl">{category.icon}</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
