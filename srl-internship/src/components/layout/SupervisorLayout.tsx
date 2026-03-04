import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SupervisorLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Supervisor Portal</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">Welcome, {user?.fullName}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
