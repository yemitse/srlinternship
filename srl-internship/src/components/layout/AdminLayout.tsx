import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Users, Calendar, GraduationCap, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">SRL Internship</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-grow p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-2 my-1 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors',
                  isActive && 'bg-indigo-100 text-indigo-600 font-semibold'
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
