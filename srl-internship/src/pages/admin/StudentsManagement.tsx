import { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import StudentProgressCard from '../../components/StudentProgressCard';

export default function StudentsManagement() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const allUsers: User[] = await response.json();
        setStudents(allUsers.filter(u => u.role === UserRole.Student));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="text-center">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <StudentProgressCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
