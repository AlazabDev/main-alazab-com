import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX, Plus } from "lucide-react";

interface EmptyRequestsStateProps {
  onCreateClick?: () => void;
}

export function EmptyRequestsState({ onCreateClick }: EmptyRequestsStateProps) {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">لا توجد طلبات صيانة</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          ابدأ بإنشاء طلب صيانة جديد لتتبع أعمال الصيانة والإصلاح
        </p>
        {onCreateClick && (
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            إنشاء طلب جديد
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
