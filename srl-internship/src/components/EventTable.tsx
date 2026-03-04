import { Event } from '../types';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
}

export default function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(event.dateTime), 'PPpp')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/admin/events/${event.id}`} className="text-gray-600 hover:text-gray-900">
                  <Eye className="h-5 w-5 inline-block" />
                </Link>
                <button onClick={() => onEdit(event)} className="text-indigo-600 hover:text-indigo-900 ml-4">
                  <Edit className="h-5 w-5 inline-block" />
                </button>
                <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-900 ml-4">
                  <Trash2 className="h-5 w-5 inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
