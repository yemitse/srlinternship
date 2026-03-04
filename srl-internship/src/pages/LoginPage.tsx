import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLoginAs = (role: UserRole) => {
    let email = '';
    if (role === UserRole.Admin) email = 'admin@srl.com';
    if (role === UserRole.Supervisor) email = 'supervisor@srl.com';
    if (role === UserRole.Student) email = 'student@srl.com';
    login({ email, role } as any);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">SRL Internship Login</h1>
        <div className="space-y-4">
          <button
            onClick={() => handleLoginAs(UserRole.Student)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Log in as Student
          </button>
          <button
            onClick={() => handleLoginAs(UserRole.Supervisor)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Log in as Supervisor
          </button>
          <button
            onClick={() => handleLoginAs(UserRole.Admin)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Log in as Internship Coordinator
          </button>
        </div>
      </div>
    </div>
  );
}
