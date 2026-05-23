import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import PageWrapper from '../components/layout/PageWrapper';
import StatCard from '../components/dashboard/StatCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await useAxios.get('/api/tasks/dashboard');
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-500 text-sm">Aggregating real-time stats...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center max-w-lg mx-auto mt-10 shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-650 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Metrics Synchronization Failed</h3>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm rounded-xl text-sm font-semibold cursor-pointer"
          >
            Retry Sync
          </button>
        </div>
      </PageWrapper>
    );
  }

  const statCards = [
    {
      title: 'Total Workspace Tasks',
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
      shadow: 'shadow-blue-500/5'
    },
    {
      title: 'Active Operations',
      value: stats?.pendingTasks || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
      shadow: 'shadow-amber-500/5'
    },
    {
      title: 'Completed Achievements',
      value: stats?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      shadow: 'shadow-emerald-500/5'
    },
    {
      title: 'Overdue Milestones',
      value: stats?.overdueTasks || 0,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600 border border-red-100',
      shadow: 'shadow-red-500/5'
    }
  ];

  // Calculate percentages for completion bar
  const total = stats?.totalTasks || 0;
  const completedPct = total > 0 ? Math.round((stats.completedTasks / total) * 100) : 0;
  const activePct = total > 0 ? Math.round((stats.pendingTasks / total) * 100) : 0;

  return (
    <PageWrapper>
      {/* Greetings Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-bold tracking-widest uppercase">Workspace Insights</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hello, {user?.name}!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {user?.role === 'Admin' 
                ? 'Manage all workspace teams, create projects, and review milestones.' 
                : 'Review and update status coordinates of your assigned tasks.'}
            </p>
          </div>
          <div>
            <Link 
              to="/projects"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/5 inline-flex items-center gap-2 group transition-all cursor-pointer"
            >
              Go to Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <StatCard 
            key={i} 
            title={card.title} 
            value={card.value} 
            icon={card.icon} 
            color={card.color} 
            shadow={card.shadow} 
          />
        ))}
      </div>

      {/* Progress Chart & Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Completion Metrics */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Completion Progress</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-2">
                <span>Completed Tasks</span>
                <span className="text-emerald-600">{completedPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completedPct}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-2">
                <span>Active Tasks</span>
                <span className="text-amber-600">{activePct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${activePct}%` }}
                ></div>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Completed
                </span>
                <span className="text-slate-900">{stats?.breakdown?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span> In Progress
                </span>
                <span className="text-slate-900">{stats?.breakdown?.inProgress || 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-505">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span> Pending
                </span>
                <span className="text-slate-900">{stats?.breakdown?.pending || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-2xl">
                <ListTodo className="h-8 w-8 text-slate-400 mb-2" />
                <h5 className="font-bold text-slate-500">No Operations Recorded</h5>
                <p className="text-slate-505 text-xs mt-1">There are no tasks logged in your workspace.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
