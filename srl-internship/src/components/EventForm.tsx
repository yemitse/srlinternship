import { useState, useEffect } from 'react';
import { Event, EventStatus, User, UserRole } from '../types';

interface EventFormProps {
  event?: Event | null;
  supervisors: User[];
  onSave: (event: Event) => void;
  onCancel: () => void;
}

export default function EventForm({ event, supervisors, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<Event>({
    id: event?.id || 0,
    title: event?.title || '',
    description: event?.description || '',
    dateTime: event?.dateTime ? new Date(event.dateTime).toISOString().substring(0, 16) : '',
    location: event?.location || '',
    hoursAwarded: event?.hoursAwarded || 0,
    slotsAvailable: event?.slotsAvailable || 0,
    assignedSupervisorId: event?.assignedSupervisorId || 0,
    status: event?.status || EventStatus.Open,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        dateTime: new Date(event.dateTime).toISOString().substring(0, 16),
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hours Awarded</label>
              <input type="number" name="hoursAwarded" value={formData.hoursAwarded} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slots Available</label>
              <input type="number" name="slotsAvailable" value={formData.slotsAvailable} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Supervisor</label>
            <select name="assignedSupervisorId" value={formData.assignedSupervisorId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
              <option value="">Select a Supervisor</option>
              {supervisors.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              {Object.values(EventStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
