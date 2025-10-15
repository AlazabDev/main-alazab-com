import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export function ProjectFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  typeFilter,
  setTypeFilter,
}: ProjectFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-6 space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث عن مشروع أو عميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">الحالة</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="planning">التخطيط</SelectItem>
              <SelectItem value="design">التصميم</SelectItem>
              <SelectItem value="licensing">الترخيص</SelectItem>
              <SelectItem value="construction">قيد التنفيذ</SelectItem>
              <SelectItem value="finishing">التشطيب</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="maintenance">صيانة دورية</SelectItem>
              <SelectItem value="on_hold">معلق</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">السنة</label>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="جميع السنوات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع السنوات</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">نوع المشروع</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="جميع الأنواع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="residential">سكني</SelectItem>
              <SelectItem value="commercial">تجاري</SelectItem>
              <SelectItem value="administrative">إداري</SelectItem>
              <SelectItem value="mixed">متعدد الاستخدامات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
