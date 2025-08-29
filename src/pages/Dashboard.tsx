import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MaintenanceChart } from "@/components/dashboard/MaintenanceChart";
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:mr-64">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                مرحباً بك في لوحة التحكم نبيه
              </h1>
              <p className="text-muted-foreground">
                نظرة عامة على الميزانية الشهرية وإحصائيات طلبات الصيانة
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="الطلبات المعلقة"
                value="0"
                icon={Clock}
                iconColor="text-warning"
              />
              
              <StatsCard
                title="الطلبات المضافة اليوم"
                value="1"
                subtitle="تقدير الأدنى"
                icon={Wrench}
                iconColor="text-primary"
              />
              
              <StatsCard
                title="الطلبات المكتملة"
                value="0"
                subtitle="0%"
                icon={CheckCircle}
                iconColor="text-success"
              />
              
              <StatsCard
                title="إجمالي طلبات الصيانة"
                value="2"
                icon={TrendingUp}
                iconColor="text-secondary"
              />
            </div>

            {/* Monthly Budget Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StatsCard
                title="الطلبات هذا الشهر"
                value="2"
                subtitle="استخدام الميزانية"
                icon={Wrench}
                iconColor="text-primary"
                className="lg:col-span-1"
              />
              
              <StatsCard
                title="الميزانية المتبقية"
                value="EGP 2,624.94"
                icon={DollarSign}
                iconColor="text-success"
                className="lg:col-span-1"
              />
              
              <StatsCard
                title="المبلغ المدفوع"
                value="EGP 375.06"
                icon={CheckCircle}
                iconColor="text-secondary"
                className="lg:col-span-1"
              />
              
              <StatsCard
                title="إجمالي الميزانية"
                value="EGP 3,000.00"
                subtitle="مستوى 0%"
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
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">نسبة العقارات النشطة</div>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border card-elegant">
                <div className="text-3xl font-bold text-muted-foreground">0%</div>
                <div className="text-sm text-muted-foreground">نسبة الطلبات الملغاة</div>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border card-elegant">
                <div className="text-3xl font-bold text-muted-foreground">0%</div>
                <div className="text-sm text-muted-foreground">نسبة الطلبات قيد التنفيذ</div>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg border card-elegant">
                <div className="text-3xl font-bold text-muted-foreground">0%</div>
                <div className="text-sm text-muted-foreground">نسبة الطلبات المكتملة</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;