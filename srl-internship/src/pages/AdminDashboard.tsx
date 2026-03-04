import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Event, Enrollment, UserRole, EventStatus, EnrollmentStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Calendar, ClipboardList, Hourglass } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, supervisors: 0, openEvents: 0, pendingEnrollments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [usersRes, eventsRes, enrollmentsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/events'),
          fetch('/api/enrollments'),
        ]);

        if (!usersRes.ok || !eventsRes.ok || !enrollmentsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const users: User[] = await usersRes.json();
        const events: Event[] = await eventsRes.json();
        const enrollments: Enrollment[] = await enrollmentsRes.json();

        setStats({
          students: users.filter(u => u.role === UserRole.Student).length,
          supervisors: users.filter(u => u.role === UserRole.Supervisor).length,
          openEvents: events.filter(e => e.status === EventStatus.Open).length,
          pendingEnrollments: enrollments.filter(e => e.enrollmentStatus === EnrollmentStatus.Pending).length,
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Total Students" value={stats.students} />
        <StatCard icon={Users} title="Total Supervisors" value={stats.supervisors} />
        <StatCard icon={Calendar} title="Open Events" value={stats.openEvents} />
        <StatCard icon={Hourglass} title="Pending Enrollments" value={stats.pendingEnrollments} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link to="/admin/users" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">Manage Users</Link>
          <Link to="/admin/events" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">Manage Events</Link>
          <Link to="/admin/students" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">Manage Students</Link>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
}

function StatCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
