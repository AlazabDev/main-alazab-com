import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MaintenanceChart } from "@/components/dashboard/MaintenanceChart";
import { useStats } from "@/hooks/useSupabaseData";
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const stats = useStats();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          مرحباً بك في لوحة التحكم
        </h1>
        <p className="text-muted-foreground">
          نظرة عامة على الميزانية الشهرية وإحصائيات طلبات الصيانة
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="الطلبات المعلقة"
          value={stats.pendingRequests.toString()}
          icon={Clock}
          iconColor="text-warning"
        />
        
        <StatsCard
          title="الطلبات المضافة اليوم"
          value={stats.todayRequests.toString()}
          subtitle="طلبات جديدة"
          icon={Wrench}
          iconColor="text-primary"
        />
        
        <StatsCard
          title="الطلبات المكتملة"
          value={stats.completedRequests.toString()}
          subtitle={`${stats.totalRequests > 0 ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}%`}
          icon={CheckCircle}
          iconColor="text-success"
        />
        
        <StatsCard
          title="إجمالي طلبات الصيانة"
          value={stats.totalRequests.toString()}
          icon={TrendingUp}
          iconColor="text-secondary"
        />
      </div>

      {/* Monthly Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatsCard
          title="الطلبات هذا الشهر"
          value={stats.thisMonthRequests.toString()}
          subtitle="طلبات الشهر الحالي"
          icon={Wrench}
          iconColor="text-primary"
          className="lg:col-span-1"
        />
        
        <StatsCard
          title="الميزانية المتبقية"
          value={`EGP ${(stats.totalBudget - stats.actualCost).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-success"
          className="lg:col-span-1"
        />
        
        <StatsCard
          title="المبلغ المدفوع"
          value={`EGP ${stats.actualCost.toLocaleString()}`}
          icon={CheckCircle}
          iconColor="text-secondary"
          className="lg:col-span-1"
        />
        
        <StatsCard
          title="إجمالي الميزانية"
          value={`EGP ${stats.totalBudget.toLocaleString()}`}
          subtitle={`استخدام ${stats.totalBudget > 0 ? Math.round((stats.actualCost / stats.totalBudget) * 100) : 0}%`}
          icon={TrendingUp}
          iconColor="text-primary"
          className="lg:col-span-1"
        />
      </div>

      {/* Charts */}
      <MaintenanceChart />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRequests />
        <QuickActions />
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-card rounded-lg border card-elegant">
          <div className="text-3xl font-bold text-primary">{stats.activeVendors}</div>
          <div className="text-sm text-muted-foreground">الموردون النشطون</div>
        </div>
        
        <div className="text-center p-6 bg-card rounded-lg border card-elegant">
          <div className="text-3xl font-bold text-muted-foreground">
            {stats.totalRequests > 0 ? Math.round((stats.totalRequests - stats.completedRequests - stats.pendingRequests) / stats.totalRequests * 100) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">نسبة الطلبات الملغاة</div>
        </div>
        
        <div className="text-center p-6 bg-card rounded-lg border card-elegant">
          <div className="text-3xl font-bold text-primary">
            {stats.totalRequests > 0 ? Math.round((stats.totalRequests - stats.completedRequests - stats.pendingRequests) / stats.totalRequests * 100) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">نسبة الطلبات قيد التنفيذ</div>
        </div>
        
        <div className="text-center p-6 bg-card rounded-lg border card-elegant">
          <div className="text-3xl font-bold text-success">
            {stats.totalRequests > 0 ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">نسبة الطلبات المكتملة</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;