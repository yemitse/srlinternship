import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="p-4 text-center">User not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <CardTitle>{user.fullName}</CardTitle>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <span>{user.email}</span>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold mb-2">Hour Summary</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Enrolled Hours:</span>
              <span className="font-bold">{user.totalEnrolledHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Completed Hours:</span>
              <span className="font-bold">{user.totalCompletedHours}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <button
        onClick={logout}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
