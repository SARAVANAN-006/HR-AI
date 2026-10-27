import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, User, ShieldAlert, Activity, ArrowRight, Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please provide administrator username and master key.");
      setLoading(false);
      return;
    }

    try {
      const success = await login(username.trim(), password.trim());
      if (success) {
        const rawUser = localStorage.getItem('kodexis_user');
        let role = '';
        try {
          if (rawUser) role = JSON.parse(rawUser).role;
        } catch {}

        if (role === 'ROLE_ADMIN' || username.trim().toLowerCase() === 'admin') {
          navigate('/admin');
          return;
        } else {
          setError("Access Denied: Account lacks administrative privileges. Candidates must log in via Candidate Portal.");
        }
      } else {
        setError("Invalid administrative credentials.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Administrative authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex items-center justify-center grid-mesh font-sans relative px-4">
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md border border-amber-500/30 bg-zinc-950/90 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.12)] p-8 relative z-10 backdrop-blur-xl">
        
        {/* Header Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Shield className="text-amber-400" size={28} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest mb-1">
            <Lock size={12} />
            <span>Restricted Access</span>
          </div>
          <h2 className="text-2xl font-bold font-mono tracking-widest text-zinc-100 uppercase">ADMIN CONSOLE</h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Platform Governance, Audit Logs & User Telemetry</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center space-x-2.5 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              Admin Identifier
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-zinc-500" size={16} />
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter administrator username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              Master Access Key
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 text-zinc-500" size={16} />
              <input
                type="password"
                autoComplete="off"
                placeholder="Enter master key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl font-bold font-mono text-sm transition flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] disabled:opacity-50"
          >
            {loading ? (
              <Activity className="animate-spin" size={16} />
            ) : (
              <>
                <span>Authenticate Admin Console</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Back to Candidate Portal */}
        <div className="mt-6 pt-5 border-t border-zinc-900 text-center">
          <Link
            to="/login"
            className="text-xs font-mono text-zinc-400 hover:text-cyan-400 transition flex items-center justify-center gap-1.5"
          >
            <span>&larr; Candidate Portal Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
