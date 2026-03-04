import { Event } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEnroll?: (eventId: number) => void;
}

export default function EventCard({ event, onEnroll }: EventCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-800">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(new Date(event.dateTime), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(new Date(event.dateTime), 'h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold">{event.hoursAwarded} Hours</span>
          {onEnroll && (
            <button
              onClick={() => onEnroll(event.id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
            >
              Enroll
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
