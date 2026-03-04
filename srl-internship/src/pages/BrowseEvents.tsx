import { useState, useEffect } from 'react';
import { Event, EventStatus } from '../types';
import EventCard from '../components/EventCard';

export default function BrowseEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Filter for events that are open for enrollment
        const openEvents = data.filter((event: Event) => event.status === EventStatus.Open);
        setEvents(openEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleEnroll = (eventId: number) => {
    // Placeholder for enrollment logic
    alert(`Enrolling in event ID: ${eventId}`);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Events</h1>
      {events.length > 0 ? (
        events.map(event => (
          <EventCard key={event.id} event={event} onEnroll={handleEnroll} />
        ))
      ) : (
        <p className="text-gray-500">No events are currently open for enrollment.</p>
      )}
    </div>
  );
}
