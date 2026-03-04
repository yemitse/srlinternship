import { useState, useEffect } from 'react';
import { Event, User, UserRole } from '../../types';
import EventTable from '../../components/EventTable';
import EventForm from '../../components/EventForm';

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [eventsRes, usersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/users'),
      ]);

      if (!eventsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const eventsData = await eventsRes.json();
      const usersData: User[] = await usersRes.json();

      setEvents(eventsData);
      setSupervisors(usersData.filter(u => u.role === UserRole.Supervisor));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = async (event: Event) => {
    try {
      const method = event.id ? 'PUT' : 'POST';
      const url = event.id ? `/api/events/${event.id}` : '/api/events';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold"
        >
          Add Event
        </button>
      </div>
      <EventTable events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      {isFormOpen && (
        <EventForm
          event={editingEvent}
          supervisors={supervisors}
          onSave={handleSaveEvent}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
