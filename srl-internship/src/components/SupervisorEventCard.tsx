import { Link } from 'react-router-dom';
import { Event } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SupervisorEventCardProps {
  event: Event;
}

export default function SupervisorEventCard({ event }: SupervisorEventCardProps) {
  return (
    <Link to={`/supervisor/event/${event.id}`}>
      <Card className="mb-4 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </Link>
  );
}
