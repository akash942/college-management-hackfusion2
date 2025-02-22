import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Calendar, FileText, Shield, MessageSquare, DollarSign, BookOpen, LucideIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Stats {
  activeVoters: string;
  pendingApprovals: string;
  todayBookings: string;
  openComplaints: string;
  activeBudgets: string;
  cheatingCases: string;
  leaveRequests: string;
  totalStudents: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  color: string;
  clickhandler?: () => void;
}

interface QuickAction {
  title: string;
  icon: LucideIcon;
}

const Dashboard: React.FC = () => {

  const navigate = useNavigate();
  
  // Sample data - replace with actual data from your backend
  const stats: Stats = {
    activeVoters: "2,845",
    pendingApprovals: "23",
    todayBookings: "12",
    openComplaints: "8",
    activeBudgets: "4",
    cheatingCases: "3",
    leaveRequests: "15",
    totalStudents: "3,200"
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, color, clickhandler }) => (
    <Card className="hover:shadow-lg transition-shadow" onClick={clickhandler}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  const quickActions: QuickAction[] = [
    { title: "Start New Election", icon: Activity },
    { title: "Book Facility", icon: Calendar },
    { title: "Submit Complaint", icon: MessageSquare },
    { title: "Track Budget", icon: DollarSign },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the College Management System. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Election Voters"
          value={stats.activeVoters}
          icon={Activity}
          description="Students participated in current election"
          color="text-blue-500"
          clickhandler={() => navigate("/elections")}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={FileText}
          description="Requests awaiting review"
          color="text-yellow-500"
        />
        <StatCard
          title="Today's Facility Bookings"
          value={stats.todayBookings}
          icon={Calendar}
          description="Facilities booked for today"
          color="text-green-500"
        />
        <StatCard
          title="Open Complaints"
          value={stats.openComplaints}
          icon={MessageSquare}
          description="Unresolved anonymous complaints"
          color="text-red-500"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Budgets"
          value={stats.activeBudgets}
          icon={DollarSign}
          description="Current budget proposals"
          color="text-purple-500"
        />
        <StatCard
          title="Academic Integrity Cases"
          value={stats.cheatingCases}
          icon={Shield}
          description="Cases under review"
          color="text-orange-500"
        />
        <StatCard
          title="Leave Requests"
          value={stats.leaveRequests}
          icon={Calendar}
          description="Pending leave notifications"
          color="text-indigo-500"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          description="Currently enrolled students"
          color="text-cyan-500"
        />
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <action.icon className="h-5 w-5" />
                <span>{action.title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;