import { useState, useEffect } from 'react';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import SupervisorEventCard from '../components/SupervisorEventCard';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignedEvents() {
      if (!user) return;
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const allEvents: Event[] = await response.json();
        const assignedEvents = allEvents.filter(event => event.assignedSupervisorId === user.id);

        const now = new Date();
        const upcoming = assignedEvents.filter(e => new Date(e.dateTime) >= now);
        const past = assignedEvents.filter(e => new Date(e.dateTime) < now);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedEvents();
  }, [user]);

  if (loading) {
    return <div className="p-4 text-center">Loading your events...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <SupervisorEventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500">You have no upcoming events.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          pastEvents.map(event => (
            <SupervisorEventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500">You have no past events.</p>
        )}
      </div>
    </div>
  );
}
