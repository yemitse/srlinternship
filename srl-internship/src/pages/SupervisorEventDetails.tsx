import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event, Enrollment, User, AttendanceStatus, PerformanceGrade } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { format } from 'date-fns';

export default function SupervisorEventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<(Enrollment & { student: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, [eventId]);

  async function fetchDetails() {
    try {
      setLoading(true);
      const [eventRes, enrollmentsRes, usersRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch('/api/enrollments'),
        fetch('/api/users'),
      ]);

      if (!eventRes.ok || !enrollmentsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch event details');
      }

      const eventData: Event = await eventRes.json();
      const allEnrollments: Enrollment[] = await enrollmentsRes.json();
      const allUsers: User[] = await usersRes.json();

      const eventEnrollments = allEnrollments.filter(e => e.eventId === parseInt(eventId!));
      const joined = eventEnrollments.map(enrollment => ({
        ...enrollment,
        student: allUsers.find(u => u.id === enrollment.studentId)!,
      })).filter(e => e.student);

      setEvent(eventData);
      setEnrolledStudents(joined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEnrollmentUpdate = async (enrollmentId: number, attendance: AttendanceStatus, performanceGrade: PerformanceGrade) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/attendance`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendance, performanceGrade }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update enrollment');
      }

      fetchDetails(); // Re-fetch to update the UI
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-4">Loading details...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!event) return <div className="text-center p-4">Event not found.</div>;

  const isPastEvent = new Date(event.dateTime) < new Date();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
        <CardContent>
          <p>{event.description}</p>
          <p className="mt-2"><strong>Date:</strong> {format(new Date(event.dateTime), 'PPPp')}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrolledStudents.map(e => (
              <tr key={e.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.student.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    disabled={!isPastEvent}
                    value={e.attendance}
                    onChange={(evt) => handleEnrollmentUpdate(e.id, evt.target.value as AttendanceStatus, e.performanceGrade)}
                    className="border border-gray-300 rounded-md shadow-sm py-1 px-2"
                  >
                    {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    disabled={!isPastEvent}
                    value={e.performanceGrade}
                    onChange={(evt) => handleEnrollmentUpdate(e.id, e.attendance, evt.target.value as PerformanceGrade)}
                    className="border border-gray-300 rounded-md shadow-sm py-1 px-2"
                  >
                    {Object.values(PerformanceGrade).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
