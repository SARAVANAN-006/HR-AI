import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StartInterview from './pages/StartInterview';
import InterviewRoom from './pages/InterviewRoom';
import Report from './pages/Report';
import AdminDashboard from './pages/AdminDashboard';
import { LayoutDashboard, Play, ShieldAlert, LogOut, Code, Activity, BrainCircuit } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <Activity className="animate-spin text-brand-cyan mb-2" size={32} />
        <span className="text-sm text-zinc-400">CONNECTING TO KODEXIS LAB...</span>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role === 'ROLE_CANDIDATE' && !user.isOnboarded && window.location.pathname !== '/onboard') {
    return <Navigate to="/onboard" replace />;
  }

  if (requireAdmin && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'ROLE_ADMIN'
    ? [{ name: 'Admin Console', path: '/admin', icon: ShieldAlert }]
    : [
        { name: 'Dashboard Console', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Start AI Interview', path: '/start-interview', icon: Play },
      ];

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-background-panel border-r border-border flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-border flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center">
              <Code size={16} className="text-brand-cyan" />
            </div>
            <div>
              <h1 className="text-md font-mono font-bold tracking-widest text-zinc-100 uppercase">KODEXIS</h1>
              <p className="text-[9px] text-zinc-500 font-mono tracking-tight">INTERVIEW LAB V1.0</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-mono transition ${
                    isActive
                      ? 'bg-zinc-800/50 text-brand-cyan border-l-2 border-brand-cyan'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status readouts at sidebar bottom */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Telemetry Status</p>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Activity size={10} className="text-brand-cyan" /> Piston API:
                </span>
                <span className="text-brand-emerald flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span> ONLINE
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 flex items-center gap-1">
                  <BrainCircuit size={10} className="text-brand-violet" /> Assessment Brain:
                </span>
                <span className="text-brand-emerald flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span> READY
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-zinc-300 truncate">{user?.fullName}</p>
              <p className="text-[9px] font-mono text-zinc-500 truncate uppercase">{user?.role.replace('ROLE_', '')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
              title="Logout session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Onboarding Guard */}
        <Route
          path="/onboard"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard layouts protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-interview"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StartInterview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Full IDE and Reports are distraction-free outside standard sidebar */}
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <InterviewRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const RootApp: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
