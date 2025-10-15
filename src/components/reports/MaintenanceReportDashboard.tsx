import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { Calendar, Download, RefreshCw, Eye, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const COLORS = {
  completed: 'hsl(var(--success))',
  in_progress: 'hsl(var(--primary))',
  pending: 'hsl(var(--warning))',
};

export function MaintenanceReportDashboard() {
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [startDate, endDate]);

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;

  const statusData = [
    { name: 'مكتملة', value: completedRequests, color: COLORS.completed },
    { name: 'قيد التنفيذ', value: inProgressRequests, color: COLORS.in_progress },
    { name: 'في انتظار الموافقة', value: pendingRequests, color: COLORS.pending },
  ];

  // Group by month for timeline
  const monthlyData = requests.reduce((acc: any[], req) => {
    const month = format(new Date(req.created_at), 'MMMM');
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>تقارير الصيانة</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">طلبات الصيانة والإحصائيات</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">من تاريخ</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">إلى تاريخ</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={fetchRequests}>
                <Calendar className="h-4 w-4 ml-2" />
                تطبيق
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
            <p className="text-3xl font-bold text-primary">{totalRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الطلبات المعلقة</p>
            <p className="text-3xl font-bold text-warning">{pendingRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الطلبات قيد التنفيذ</p>
            <p className="text-3xl font-bold text-primary">{inProgressRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الطلبات المكتملة</p>
            <p className="text-3xl font-bold text-success">{completedRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>حالة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات طلبات الصيانة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="طلبات الصيانة"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>أحدث طلبات الصيانة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">رقم الطلب</th>
                  <th className="text-right py-3 px-4">العقار</th>
                  <th className="text-right py-3 px-4">الخدمة</th>
                  <th className="text-right py-3 px-4">الحالة</th>
                  <th className="text-right py-3 px-4">تاريخ الطلب</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((request) => (
                  <tr key={request.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Badge className="bg-primary/10 text-primary">
                        MR-{request.id.substring(0, 8).toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{request.location}</td>
                    <td className="py-3 px-4">
                      <Badge>{request.service_type}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={
                        request.status === 'completed' ? 'bg-success/10 text-success' :
                        request.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                        'bg-warning/10 text-warning'
                      }>
                        {request.status === 'completed' ? 'تم التعيين' :
                         request.status === 'in_progress' ? 'قيد التنفيذ' : 'سباكة'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(request.created_at), 'yyyy-MM-dd HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/requests/${request.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
