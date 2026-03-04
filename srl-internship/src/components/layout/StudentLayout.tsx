import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, ClipboardList, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/student', label: 'Home', icon: Home },
  { href: '/student/events', label: 'Events', icon: Calendar },
  { href: '/student/schedule', label: 'Schedule', icon: ClipboardList },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow pb-20">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full text-sm font-medium transition-colors',
                  isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                )
              }
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </footer>
    </div>
  );
}
