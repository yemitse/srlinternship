import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event, Enrollment, User, EnrollmentStatus } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import StudentEnrollmentTable from '../../components/StudentEnrollmentTable';
import { format } from 'date-fns';

export default function AdminEventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { student: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  async function fetchEventData() {
    try {
      setLoading(true);
      const [eventRes, enrollmentsRes, usersRes] = await Promise.all([
        fetch(`/api/events/${eventId}`), // This endpoint doesn't exist yet
        fetch('/api/enrollments'),
        fetch('/api/users'),
      ]);

      if (!eventRes.ok || !enrollmentsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch event data');
      }

      const eventData = await eventRes.json();
      const enrollmentsData: Enrollment[] = await enrollmentsRes.json();
      const usersData: User[] = await usersRes.json();

      const eventEnrollments = enrollmentsData.filter(e => e.eventId === parseInt(eventId!));
      const joinedEnrollments = eventEnrollments.map(enrollment => ({
        ...enrollment,
        student: usersData.find(u => u.id === enrollment.studentId)!,
      })).filter(e => e.student);

      setEvent(eventData);
      setEnrollments(joinedEnrollments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (enrollmentId: number, newStatus: EnrollmentStatus) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enrollmentStatus: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update enrollment status');
      }

      fetchEventData(); // Re-fetch to update the UI
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="text-center">Event not found.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Date:</strong> {format(new Date(event.dateTime), 'PPP')}</p>
            <p><strong>Time:</strong> {format(new Date(event.dateTime), 'p')}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Hours:</strong> {event.hoursAwarded}</p>
            <p><strong>Slots:</strong> {event.slotsAvailable}</p>
            <p><strong>Status:</strong> {event.status}</p>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
        <StudentEnrollmentTable enrollments={enrollments} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}
