import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  Briefcase, 
  LogOut, 
  User as UserIcon,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { User, UserRole, Event, EventSession, Enrollment, AttendanceRecord, StudentStats } from './types';

// --- Contexts ---
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
} | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Internship Coordinator', 'Supervisor', 'Student'] },
    { id: 'events', label: 'Events', icon: Briefcase, roles: ['Internship Coordinator', 'Student'] },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, roles: ['Internship Coordinator', 'Supervisor', 'Student'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['Internship Coordinator'] },
    { id: 'profile', label: 'Profile', icon: UserIcon, roles: ['Internship Coordinator', 'Supervisor', 'Student'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tighter text-emerald-500">SRL Internship</h1>
          <p className="text-xs text-zinc-500 mt-1">Management System v3</p>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon size={20} className="text-zinc-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// --- Pages ---

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  if (view === 'register') return <Register onBack={() => setView('login')} />;
  if (view === 'forgot') return <ForgotPassword onBack={() => setView('login')} />;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Briefcase className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome Back</h2>
          <p className="text-zinc-500 mt-2">Sign in to manage your internship</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setView('forgot')}
              className="text-sm text-emerald-600 font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200 shadow-none' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/10'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account? {' '}
            <button 
              onClick={() => setView('register')}
              className="text-emerald-600 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Register = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    chinese_name: '',
    student_id_num: '',
    email: '',
    password: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Application Sent</h2>
          <p className="text-zinc-500 mt-2">Your account application has been submitted. An administrator will review it and assign your role.</p>
          <button onClick={onBack} className="mt-8 w-full bg-zinc-900 text-white font-bold py-4 rounded-xl">Back to Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">English Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="e.g. Alice Smith" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Chinese Full Name</label>
            <input type="text" required value={formData.chinese_name} onChange={e => setFormData({...formData, chinese_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="e.g. 陳大文" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Student ID</label>
            <input type="text" required value={formData.student_id_num} onChange={e => setFormData({...formData, student_id_num: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="e.g. 20240001" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">School Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="name@school.edu" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20">Apply for Account</button>
          <button type="button" onClick={onBack} className="w-full text-zinc-500 font-bold py-2">Cancel</button>
        </form>
      </motion.div>
    </div>
  );
};

const ForgotPassword = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [newPassword, setNewPassword] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMessage(data.message);
    setStep('reset'); // In a real app, this would happen after clicking an email link
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    if (res.ok) {
      alert('Password reset successful!');
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Forgot Password</h2>
        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <p className="text-sm text-zinc-500 text-center">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="name@school.edu" />
            </div>
            <button type="submit" className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl">Send Reset Link</button>
            <button type="button" onClick={onBack} className="w-full text-zinc-500 font-bold py-2">Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-sm text-emerald-600 bg-emerald-50 p-4 rounded-xl mb-4">{message}</p>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">New Password</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl">Reset Password</button>
            <button type="button" onClick={onBack} className="w-full text-zinc-500 font-bold py-2">Cancel</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [studentSessions, setStudentSessions] = useState<EventSession[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<User[]>([]);
  const [criticalStudents, setCriticalStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'Student') {
          const statsRes = await fetch(`/api/students/${user.id}/stats`);
          setStats(await statsRes.json());
          
          const sessionsRes = await fetch(`/api/students/${user.id}/history`);
          const sessionsData = await sessionsRes.json();
          // Filter for upcoming sessions
          const now = new Date();
          const upcoming = sessionsData
            .filter((s: any) => new Date(s.start_time) > now)
            .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
          setStudentSessions(upcoming);
        }
        
        if (user?.role === 'Internship Coordinator') {
          // Fetch all events to find pending enrollments
          const eventsRes = await fetch('/api/events');
          const allEvents = await eventsRes.json();
          setEvents(allEvents);

          const pending: any[] = [];
          const studentsWithStats: any[] = [];

          for (const event of allEvents) {
            const detRes = await fetch(`/api/events/${event.id}`);
            const det = await detRes.json();
            pending.push(...det.enrollments.filter((e: any) => e.status === 'Pending').map((e: any) => ({ ...e, eventTitle: event.title })));
          }
          setPendingEnrollments(pending);

          // Fetch pending account applications
          const appsRes = await fetch('/api/applications');
          setPendingApplications(await appsRes.json());

          // Fetch all users to check for critical students
          const usersRes = await fetch('/api/users');
          const allUsers = await usersRes.json();
          const students = allUsers.filter((u: any) => u.role === 'Student');
          
          for (const s of students) {
            const sRes = await fetch(`/api/students/${s.id}/stats`);
            const sStats = await sRes.json();
            if (sStats.completedHours < 50) { // Example threshold for "critical"
              studentsWithStats.push({ ...s, ...sStats });
            }
          }
          setCriticalStudents(studentsWithStats);
        } else {
          const eventsRes = await fetch('/api/events');
          setEvents(await eventsRes.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleApproveApp = async (id: number, role: string) => {
    await fetch(`/api/users/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    setPendingApplications(prev => prev.filter(a => a.id !== id));
  };

  const handleRejectApp = async (id: number) => {
    await fetch(`/api/users/${id}/reject`, { method: 'PATCH' });
    setPendingApplications(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Welcome back, {user?.name}. Here's what's happening.</p>
      </header>

      {user?.role === 'Internship Coordinator' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Pending Enrollments</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-blue-600">{pendingEnrollments.length}</span>
              <span className="text-zinc-400">requests</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Account Apps</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-violet-600">{pendingApplications.length}</span>
              <span className="text-zinc-400">pending</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Active Events</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-emerald-600">{events.filter(e => e.status === 'Open for Enrollment').length}</span>
              <span className="text-zinc-400">open</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Critical Alerts</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-red-500">{criticalStudents.length}</span>
              <span className="text-zinc-400">students</span>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Internship Coordinator' && pendingApplications.length > 0 && (
        <section className="bg-violet-50 p-6 rounded-3xl border border-violet-100">
          <div className="flex items-center gap-2 mb-4 text-violet-600">
            <UserIcon size={20} />
            <h3 className="font-bold">Pending Account Applications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplications.map(app => (
              <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border border-violet-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-zinc-900">{app.name} ({app.chinese_name})</p>
                    <p className="text-xs text-zinc-500">{app.email}</p>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">ID: {app.student_id_num}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveApp(app.id, 'Student')} className="flex-1 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600">Approve Student</button>
                  <button onClick={() => handleApproveApp(app.id, 'Supervisor')} className="flex-1 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600">Approve Supervisor</button>
                  <button onClick={() => handleRejectApp(app.id)} className="px-4 py-2 border border-zinc-200 text-zinc-500 text-xs font-bold rounded-lg hover:bg-zinc-50">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {user?.role === 'Internship Coordinator' && criticalStudents.length > 0 && (
        <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <AlertCircle size={20} />
            <h3 className="font-bold">Critical Student Alerts</h3>
          </div>
          <div className="space-y-3">
            {criticalStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                <div>
                  <p className="font-bold text-zinc-900">{s.name}</p>
                  <p className="text-xs text-zinc-500">{s.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">{s.completedHours} / 200 hrs</p>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Low Progress</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {user?.role === 'Student' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Completed Hours</h3>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-zinc-900">{stats.completedHours}</span>
              <span className="text-zinc-400 text-lg">/ 200 hrs</span>
            </div>
            <div className="mt-6 w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${Math.min((stats.completedHours / 200) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Enrolled Hours</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="text-blue-500" size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-zinc-900">{stats.enrolledHours}</span>
              <span className="text-zinc-400 text-lg">hrs total</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500">Hours from all accepted event enrollments.</p>
          </div>
        </div>
      )}

      {user?.role === 'Student' && studentSessions.length > 0 && (
        <section className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900">My Upcoming Sessions</h3>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Confirmed</span>
          </div>
          <div className="space-y-4">
            {studentSessions.slice(0, 3).map(session => (
              <div key={session.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm border border-zinc-100">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date(session.start_time).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-bold text-zinc-900">{new Date(session.start_time).getDate()}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900">{session.title}</h4>
                  <p className="text-xs text-emerald-500 font-medium">{session.event_title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900">{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{session.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-zinc-900">Recent Events</h3>
          <button className="text-emerald-500 font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  event.status === 'Open for Enrollment' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {event.status}
                </span>
                <button className="text-zinc-300 group-hover:text-zinc-900 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-2">{event.title}</h4>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{event.slots} Slots</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon size={14} />
                  <span>{event.supervisor_name || 'No Supervisor'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [manualEnrollStudentId, setManualEnrollStudentId] = useState<string>('');
  const [manualEnrollStatus, setManualEnrollStatus] = useState<string>('Accepted');
  const [editSessions, setEditSessions] = useState<Partial<EventSession>[]>([]);
  
  // Multi-session creation state
  const [newSessions, setNewSessions] = useState<Partial<EventSession>[]>([
    { title: 'Session 1', start_time: '', end_time: '', location: '', hours: 0 }
  ]);

  useEffect(() => {
    fetchEvents();
    if (user?.role === 'Internship Coordinator') {
      fetchSupervisors();
      fetchStudents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      // Fetch sessions for each event to show summary on card
      const eventsWithSessions = await Promise.all(data.map(async (e: Event) => {
        const detRes = await fetch(`/api/events/${e.id}`);
        if (!detRes.ok) return { ...e, sessions: [], enrollments: [] };
        return await detRes.json();
      }));
      setEvents(eventsWithSessions);
    } catch (e) {
      console.error("Failed to fetch events:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisors = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setSupervisors(data.filter((u: User) => u.role === 'Supervisor' || u.role === 'Internship Coordinator'));
  };

  const fetchStudents = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setAllStudents(data.filter((u: User) => u.role === 'Student'));
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get('title'),
      description: formData.get('description'),
      slots: Number(formData.get('slots')),
      supervisor_id: Number(formData.get('supervisor_id')),
      status: 'Open for Enrollment'
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (res.ok) {
      const { id: eventId } = await res.json();
      // Create sessions
      for (const session of newSessions) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...session, event_id: eventId })
        });
      }
      setShowCreate(false);
      setNewSessions([{ title: 'Session 1', start_time: '', end_time: '', location: '', hours: 0 }]);
      fetchEvents();
    }
  };

  const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get('title'),
      description: formData.get('description'),
      slots: Number(formData.get('slots')),
      supervisor_id: Number(formData.get('supervisor_id')),
      status: formData.get('status'),
      sessions: editSessions
    };

    const res = await fetch(`/api/events/${selectedEvent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (res.ok) {
      setShowEdit(false);
      fetchEvents();
      viewDetails(selectedEvent.id);
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEnrollStudentId) return;

    const res = await fetch('/api/admin/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: Number(manualEnrollStudentId),
        event_id: selectedEvent.id,
        status: manualEnrollStatus
      })
    });

    if (res.ok) {
      alert('Student enrolled successfully!');
      setManualEnrollStudentId('');
      viewDetails(selectedEvent.id);
      fetchEvents();
    } else {
      alert('Failed to enroll student.');
    }
  };

  const addSessionRow = () => {
    setNewSessions([...newSessions, { title: `Session ${newSessions.length + 1}`, start_time: '', end_time: '', location: '', hours: 0 }]);
  };

  const handleEnroll = async (eventId: number) => {
    if (!user) return;
    setEnrollingId(eventId);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, event_id: eventId })
      });
      if (res.ok) {
        alert('Enrollment request sent!');
        fetchEvents();
      } else {
        const err = await res.json();
        alert(err.error || 'Already enrolled or error occurred.');
      }
    } catch (e) {
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  const viewDetails = async (id: number) => {
    const res = await fetch(`/api/events/${id}`);
    setSelectedEvent(await res.json());
  };

  const handleStatusUpdate = async (enrollmentId: number, status: string) => {
    await fetch(`/api/enrollments/${enrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    viewDetails(selectedEvent.id);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Internship Opportunities</h2>
          <p className="text-zinc-500">Browse and manage available internship events.</p>
        </div>
        {user?.role === 'Internship Coordinator' && (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            Create Event
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const totalHours = (event as any).sessions?.reduce((sum: number, s: any) => sum + s.hours, 0) || 0;
          const sessionCount = (event as any).sessions?.length || 0;
          const firstSession = (event as any).sessions?.[0];

          const enrollment = (event as any).enrollments?.find((e: any) => e.student_id === user?.id);
          const isEnrolled = !!enrollment;
          const enrollmentStatus = enrollment?.status;

          return (
            <div key={event.id} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all border-t-4 border-t-emerald-500">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    event.status === 'Open for Enrollment' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {event.status}
                  </span>
                  {sessionCount > 0 && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full">
                        {totalHours} Total Hours
                      </span>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase mt-1">{sessionCount} Sessions</span>
                    </div>
                  )}
                </div>
                <h4 className="text-xl font-bold text-zinc-900 mb-2">{event.title}</h4>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-6">{event.description}</p>
                
                <div className="space-y-4 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                  {firstSession && (
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-emerald-500">
                        <CalendarIcon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-1">First Session</span>
                        <span className="font-bold text-zinc-900">{new Date(firstSession.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-zinc-500">{new Date(firstSession.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {firstSession.location}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400">
                        <Users size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase leading-none">Slots</span>
                        <span className="font-bold text-zinc-900">{event.slots}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400">
                        <UserIcon size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase leading-none">Supervisor</span>
                        <span className="font-bold text-zinc-900 truncate max-w-[80px]">{event.supervisor_name?.split(' ')[0] || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex flex-col gap-2">
                {user?.role === 'Student' && event.status === 'Open for Enrollment' && (
                  <button 
                    onClick={() => !isEnrolled && handleEnroll(event.id)}
                    disabled={enrollingId === event.id || isEnrolled}
                    className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                      enrollingId === event.id || isEnrolled
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                    }`}
                  >
                    {enrollingId === event.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                        Enrolling...
                      </>
                    ) : isEnrolled ? (
                      <>
                        <Clock size={20} />
                        {enrollmentStatus}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        Enroll Now
                      </>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => viewDetails(event.id)}
                  className="w-full bg-white border border-zinc-200 text-zinc-700 font-bold py-3 rounded-2xl hover:bg-zinc-100 transition-all text-sm"
                >
                  View Full Details & Sessions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-zinc-900">{selectedEvent.title}</h3>
                    {user?.role === 'Internship Coordinator' && (
                      <button 
                        onClick={() => {
                          setEditSessions(selectedEvent.sessions || []);
                          setShowEdit(true);
                        }}
                        className="p-2 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Plus size={16} className="rotate-45" /> {/* Using Plus as a placeholder for edit icon if needed, or just text */}
                        <span className="text-xs font-bold ml-1">Edit</span>
                      </button>
                    )}
                  </div>
                  <p className="text-zinc-500 mt-1">{selectedEvent.status}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Description</h4>
                  <p className="text-zinc-700 leading-relaxed">{selectedEvent.description}</p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Sessions</h4>
                  <div className="space-y-4">
                    {selectedEvent.sessions.map((session: EventSession) => (
                      <div key={session.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm border border-zinc-100">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase">Hrs</span>
                          <span className="text-lg font-bold text-zinc-900">{session.hours}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-zinc-900">{session.title}</h5>
                          <div className="flex gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              <CalendarIcon size={12} />
                              <span>{new Date(session.start_time).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              <Clock size={12} />
                              <span>{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              <MapPin size={12} />
                              <span>{session.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {user?.role === 'Internship Coordinator' && (
                  <section className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Plus size={16} />
                      Manual Enrollment
                    </h4>
                    <form onSubmit={handleManualEnroll} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Select Student</label>
                        <select 
                          value={manualEnrollStudentId}
                          onChange={(e) => setManualEnrollStudentId(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none bg-white"
                          required
                        >
                          <option value="">Select a student...</option>
                          {allStudents.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.student_id_num})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full md:w-48">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</label>
                        <select 
                          value={manualEnrollStatus}
                          onChange={(e) => setManualEnrollStatus(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none bg-white"
                        >
                          <option value="Accepted">Accepted</option>
                          <option value="Waitlisted">Waitlisted</option>
                          <option value="Pending">Pending</option>
                          <option value="Withdrawal">Withdrawal</option>
                        </select>
                      </div>
                      <button type="submit" className="px-6 py-2 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all">
                        Enroll
                      </button>
                    </form>
                  </section>
                )}

                <section>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Enrollments</h4>
                  <div className="overflow-hidden rounded-2xl border border-zinc-100">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-bold">Student</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                          <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {selectedEvent.enrollments.map((en: Enrollment) => (
                          <tr key={en.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-zinc-900">{en.student_name}</p>
                              <p className="text-xs text-zinc-400">{en.student_email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                en.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                en.status === 'Waitlisted' ? 'bg-blue-50 text-blue-600' : 
                                en.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                                en.status === 'Withdrawal' ? 'bg-zinc-100 text-zinc-500' : 
                                'bg-zinc-100 text-zinc-500'
                              }`}>
                                {en.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <select 
                                  value={en.status}
                                  onChange={(e) => handleStatusUpdate(en.id, e.target.value)}
                                  className="text-xs border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Waitlisted">Waitlisted</option>
                                  <option value="Rejected">Rejected</option>
                                  <option value="Withdrawal">Withdrawal</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold mb-6">Create New Event</h3>
            <form className="space-y-6" onSubmit={handleCreateEvent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Event Title</label>
                  <input name="title" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Annual Tech Conference" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea name="description" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500 h-24" placeholder="General event description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Total Slots</label>
                  <input name="slots" type="number" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Assign Supervisor</label>
                  <select name="supervisor_id" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select Supervisor</option>
                    {supervisors.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-zinc-900">Event Sessions</h4>
                  <button 
                    type="button" 
                    onClick={addSessionRow}
                    className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Session
                  </button>
                </div>
                
                <div className="space-y-4">
                  {newSessions.map((session, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          placeholder="Session Title"
                          value={session.title}
                          onChange={(e) => {
                            const updated = [...newSessions];
                            updated[idx].title = e.target.value;
                            setNewSessions(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                        />
                        <input 
                          placeholder="Location"
                          value={session.location}
                          onChange={(e) => {
                            const updated = [...newSessions];
                            updated[idx].location = e.target.value;
                            setNewSessions(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                        />
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">Start Time</label>
                          <input 
                            type="datetime-local"
                            value={session.start_time}
                            onChange={(e) => {
                              const updated = [...newSessions];
                              updated[idx].start_time = e.target.value;
                              setNewSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">End Time</label>
                          <input 
                            type="datetime-local"
                            value={session.end_time}
                            onChange={(e) => {
                              const updated = [...newSessions];
                              updated[idx].end_time = e.target.value;
                              setNewSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">Hours Awarded</label>
                          <input 
                            type="number"
                            value={session.hours}
                            onChange={(e) => {
                              const updated = [...newSessions];
                              updated[idx].hours = Number(e.target.value);
                              setNewSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 border border-zinc-200 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold">Create Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEdit && selectedEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Event</h3>
              <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Event Title</label>
                <input name="title" defaultValue={selectedEvent.title} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea name="description" defaultValue={selectedEvent.description} rows={4} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Total Slots</label>
                  <input name="slots" type="number" defaultValue={selectedEvent.slots} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Supervisor</label>
                  <select name="supervisor_id" defaultValue={selectedEvent.supervisor_id} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500">
                    {supervisors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                <select name="status" defaultValue={selectedEvent.status} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="Open for Enrollment">Open for Enrollment</option>
                  <option value="Enrollment Closed">Enrollment Closed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-zinc-900">Edit Sessions</h4>
                  <button 
                    type="button" 
                    onClick={() => setEditSessions([...editSessions, { title: `Session ${editSessions.length + 1}`, start_time: '', end_time: '', location: '', hours: 0 }])}
                    className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Session
                  </button>
                </div>
                
                <div className="space-y-4">
                  {editSessions.map((session, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-400 uppercase">Session {idx + 1}</span>
                        <button 
                          type="button" 
                          onClick={() => setEditSessions(editSessions.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          placeholder="Session Title"
                          value={session.title}
                          onChange={(e) => {
                            const updated = [...editSessions];
                            updated[idx].title = e.target.value;
                            setEditSessions(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                        />
                        <input 
                          placeholder="Location"
                          value={session.location}
                          onChange={(e) => {
                            const updated = [...editSessions];
                            updated[idx].location = e.target.value;
                            setEditSessions(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                        />
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">Start Time</label>
                          <input 
                            type="datetime-local"
                            value={session.start_time}
                            onChange={(e) => {
                              const updated = [...editSessions];
                              updated[idx].start_time = e.target.value;
                              setEditSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">End Time</label>
                          <input 
                            type="datetime-local"
                            value={session.end_time}
                            onChange={(e) => {
                              const updated = [...editSessions];
                              updated[idx].end_time = e.target.value;
                              setEditSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-1">Hours Awarded</label>
                          <input 
                            type="number"
                            value={session.hours}
                            onChange={(e) => {
                              const updated = [...editSessions];
                              updated[idx].hours = Number(e.target.value);
                              setEditSessions(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-3 border border-zinc-200 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Calendar = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<EventSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        let url = '/api/events'; // Default for admin
        if (user?.role === 'Supervisor') url = `/api/supervisors/${user.id}/sessions`;
        if (user?.role === 'Student') url = `/api/students/${user.id}/history`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        const sortSessions = (list: any[]) => [...list].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

        if (user?.role === 'Internship Coordinator') {
          const allSessions: any[] = [];
          for (const event of data) {
            const detRes = await fetch(`/api/events/${event.id}`);
            if (!detRes.ok) continue;
            const det = await detRes.json();
            allSessions.push(...det.sessions.map((s: any) => ({ ...s, event_title: event.title })));
          }
          setSessions(sortSessions(allSessions));
        } else {
          setSessions(sortSessions(data));
        }
      } catch (e) {
        console.error("Failed to fetch sessions:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  const openAttendance = async (session: EventSession) => {
    const res = await fetch(`/api/sessions/${session.id}/attendance`);
    setAttendance(await res.json());
    setSelectedSession(session);
  };

  const markAttendance = async (enrollmentId: number, status: string, planning_score?: number, executing_score?: number, grade?: string, notes?: string) => {
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        session_id: selectedSession.id,
        status,
        planning_score,
        executing_score,
        grade,
        notes
      })
    });
    openAttendance(selectedSession);
  };

  // Grid View Logic
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day > 0 && day <= daysInMonth) return day;
    return null;
  });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  if (loading) return <div className="p-12 text-center text-zinc-400">Loading schedule...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Calendar & Schedule</h2>
          <p className="text-zinc-500">View upcoming sessions and manage attendance.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
          >
            List
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
          >
            Grid
          </button>
        </div>
      </header>

      {viewMode === 'grid' ? (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-900">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-100">
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-100">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(d => <div key={d} className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest py-2">{d}</div>)}
            {calendarDays.map((day, i) => {
              const hasSession = day && sessions.some(s => {
                const d = new Date(s.start_time);
                return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
              });
              return (
                <div key={i} className={`aspect-square rounded-2xl border border-zinc-50 flex flex-col items-center justify-center relative ${day ? 'bg-white' : 'bg-zinc-50/50'}`}>
                  {day && (
                    <>
                      <span className={`text-sm font-bold ${hasSession ? 'text-emerald-500' : 'text-zinc-400'}`}>{day}</span>
                      {hasSession && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shadow-sm" />}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
              <AlertCircle size={14} />
              Dots indicate scheduled internship sessions for this month.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">Upcoming Sessions</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Confirmed</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-zinc-100">
            {sessions.length === 0 ? (
              <div className="p-12 text-center text-zinc-400">No sessions scheduled.</div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 shadow-sm flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date(session.start_time).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-2xl font-bold text-zinc-900">{new Date(session.start_time).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">{session.title}</h4>
                      <p className="text-sm text-emerald-500 font-medium">{session.event_title}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                          <Clock size={14} />
                          <span>{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                          <MapPin size={14} />
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400 font-bold">
                          <Clock size={14} />
                          <span>{session.hours} Hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {(user?.role === 'Supervisor' || user?.role === 'Internship Coordinator') && (
                      <button 
                        onClick={() => openAttendance(session)}
                        className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
                      >
                        Manage Attendance
                      </button>
                    )}
                    {user?.role === 'Student' && (
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          (session as any).attendance_status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {(session as any).attendance_status || 'Upcoming'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">Attendance & Performance</h3>
                  <p className="text-zinc-500 mt-1">{selectedSession.title} • {selectedSession.event_title}</p>
                </div>
                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="overflow-hidden rounded-2xl border border-zinc-100">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-bold">Student</th>
                        <th className="px-6 py-4 font-bold">Attendance</th>
                        <th className="px-6 py-4 font-bold">Planning (30)</th>
                        <th className="px-6 py-4 font-bold">Executing (40)</th>
                        <th className="px-6 py-4 font-bold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {attendance.map((record) => (
                        <tr key={record.enrollment_id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-zinc-900">{record.student_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={record.status || 'Not Marked'}
                              onChange={(e) => markAttendance(record.enrollment_id, e.target.value, record.planning_score, record.executing_score, record.grade, record.notes)}
                              className="text-sm border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Not Marked">Not Marked</option>
                              <option value="Present">Present</option>
                              <option value="Late">Late</option>
                              <option value="Sick Leave">Sick Leave</option>
                              <option value="No Show">No Show</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                min="0"
                                max="30"
                                value={record.planning_score || 0}
                                onChange={(e) => markAttendance(record.enrollment_id, record.status, Number(e.target.value), record.executing_score, record.grade, record.notes)}
                                className="w-16 text-sm border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <span className="text-xs text-zinc-400">/ 30</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                min="0"
                                max="40"
                                value={record.executing_score || 0}
                                onChange={(e) => markAttendance(record.enrollment_id, record.status, record.planning_score, Number(e.target.value), record.grade, record.notes)}
                                className="w-16 text-sm border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <span className="text-xs text-zinc-400">/ 40</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text"
                              value={record.notes || ''}
                              placeholder="Add notes..."
                              onBlur={(e) => markAttendance(record.enrollment_id, record.status, record.planning_score, record.executing_score, record.grade, e.target.value)}
                              className="text-sm border border-zinc-200 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    setUsers(await res.json());
    setLoading(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">User Management</h2>
          <p className="text-zinc-500">Manage students, supervisors, and coordinators.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
        >
          <Plus size={20} />
          Add User
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Student ID</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{u.name}</p>
                      <p className="text-[10px] text-zinc-400">{u.chinese_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">{u.student_id_num || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.role === 'Internship Coordinator' ? 'bg-purple-50 text-purple-600' : 
                    u.role === 'Supervisor' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">{u.email}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-zinc-900 transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Add New User</h3>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData);
              const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              if (res.ok) {
                setShowAdd(false);
                fetchUsers();
              } else {
                alert('Error adding user. Email might already exist.');
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">English Name</label>
                  <input name="name" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Chinese Name</label>
                  <input name="chinese_name" className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Student ID</label>
                <input name="student_id_num" className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                <select name="role" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="Student">Student</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Internship Coordinator">Internship Coordinator</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-zinc-200 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('srl_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('srl_user', JSON.stringify(userData));
    } else {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('srl_user');
  };

  if (loading) return null;

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-zinc-50 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 p-6 lg:p-12 max-w-7xl mx-auto w-full">
          <div className="flex justify-end mb-6">
            <div className="relative group">
              <button className="p-2 bg-white rounded-xl shadow-sm border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all">
                <AlertCircle size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Notifications</p>
                <div className="space-y-2">
                  <div className="p-2 bg-zinc-50 rounded-lg text-xs">
                    <p className="font-bold text-zinc-900">Enrollment Accepted</p>
                    <p className="text-zinc-500">Your request for Tech Conf was approved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'events' && <Events />}
              {activeTab === 'calendar' && <Calendar />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'profile' && (
                <div className="max-w-2xl bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl">
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-zinc-900">{user.name}</p>
                        <p className="text-zinc-500">{user.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">English Name</label>
                        <p className="text-zinc-900 font-medium">{user.name}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Chinese Name</label>
                        <p className="text-zinc-900 font-medium">{user.chinese_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Student ID</label>
                        <p className="text-zinc-900 font-medium">{user.student_id_num || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</label>
                        <p className="text-zinc-900 font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-100">
                      <h3 className="text-lg font-bold text-zinc-900 mb-4">Reset Password</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const res = await fetch('/api/users/me/password', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId: user.id,
                            currentPassword: formData.get('current'),
                            newPassword: formData.get('new')
                          })
                        });
                        if (res.ok) {
                          alert('Password updated successfully!');
                          (e.target as HTMLFormElement).reset();
                        } else {
                          const data = await res.json();
                          alert(data.error || 'Failed to update password');
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Password</label>
                          <input name="current" type="password" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">New Password</label>
                          <input name="new" type="password" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                        </div>
                        <button type="submit" className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold">Update Password</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
