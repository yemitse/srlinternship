import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress'; // Will create this component next

export default function StudentDashboard() {
  const { user } = useAuth();
  const completedHours = user?.totalCompletedHours || 0;
  const progress = (completedHours / 200) * 100;

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.fullName}!</h1>
        <p className="text-gray-600">Here's your internship summary.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">{completedHours} / 200 Hours</span>
            <span className="text-lg font-bold text-indigo-600">{progress.toFixed(0)}%</span>
          </div>
          {/* A simple div for progress bar for now */}
          <div className="w-full bg-gray-200 rounded-full h-4">
             <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <Card>
          <CardContent>
            <p className="text-gray-500">You have no upcoming events.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
