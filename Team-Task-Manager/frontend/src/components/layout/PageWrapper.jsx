import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  User, 
  ShieldCheck, 
  Menu, 
  X,
  Layers
} from 'lucide-react';

const PageWrapper = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-slate-900">Task Manager</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-650 cursor-pointer"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight text-slate-900">Task Manager</h1>
              <span className="text-xs text-blue-600 font-bold tracking-wider uppercase">Enterprise</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
              {user?.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-slate-900 truncate">{user?.name}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                  ${user?.role === 'Admin' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-600 bg-slate-100 border border-slate-200'}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/15' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-650 transition-all duration-200 w-full mt-auto cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
