import { useState, useEffect } from 'react';
import { Enrollment, Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import EnrollmentCard from '../components/EnrollmentCard';

export default function MySchedule() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<(Enrollment & { event: Event })[]>([]);
  const [past, setPast] = useState<(Enrollment & { event: Event })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedule() {
      if (!user) return;
      try {
        const [enrollmentsRes, eventsRes] = await Promise.all([
          fetch('/api/enrollments'),
          fetch('/api/events'),
        ]);

        if (!enrollmentsRes.ok || !eventsRes.ok) {
          throw new Error('Failed to fetch schedule data');
        }

        const enrollments: Enrollment[] = await enrollmentsRes.json();
        const events: Event[] = await eventsRes.json();
        
        const studentEnrollments = enrollments.filter(e => e.studentId === user.id);

        const joined = studentEnrollments.map(enrollment => {
          const event = events.find(e => e.id === enrollment.eventId);
          return { ...enrollment, event: event! };
        }).filter(e => e.event); // Filter out any enrollments where the event wasn't found

        const now = new Date();
        const upcomingEvents = joined.filter(e => new Date(e.event.dateTime) >= now);
        const pastEvents = joined.filter(e => new Date(e.event.dateTime) < now);

        setUpcoming(upcomingEvents);
        setPast(pastEvents);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [user]);

  if (loading) {
    return <div className="p-4 text-center">Loading your schedule...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
        {upcoming.length > 0 ? (
          upcoming.map(enrollment => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))
        ) : (
          <p className="text-gray-500">You have no upcoming events.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Past Events</h2>
        {past.length > 0 ? (
          past.map(enrollment => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))
        ) : (
          <p className="text-gray-500">You have no past events.</p>
        )}
      </div>
    </div>
  );
}
