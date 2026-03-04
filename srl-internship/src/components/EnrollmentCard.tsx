import { Enrollment, Event, AttendanceStatus, PerformanceGrade } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface EnrollmentCardProps {
  enrollment: Enrollment & { event: Event }; // Joined data
}

const attendanceIcons = {
  [AttendanceStatus.Present]: { icon: CheckCircle, color: 'text-green-500' },
  [AttendanceStatus.Late]: { icon: AlertCircle, color: 'text-yellow-500' },
  [AttendanceStatus.SickLeave]: { icon: AlertCircle, color: 'text-blue-500' },
  [AttendanceStatus.NoShow]: { icon: XCircle, color: 'text-red-500' },
  [AttendanceStatus.NotMarked]: { icon: AlertCircle, color: 'text-gray-400' },
};

const gradeColors = {
    [PerformanceGrade.Excellent]: 'text-green-500',
    [PerformanceGrade.Good]: 'text-blue-500',
    [PerformanceGrade.Satisfactory]: 'text-yellow-500',
    [PerformanceGrade.NeedsImprovement]: 'text-red-500',
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { event } = enrollment;
  const isPast = new Date(event.dateTime) < new Date();
  const AttendanceIcon = attendanceIcons[enrollment.attendance]?.icon || AlertCircle;
  const attendanceColor = attendanceIcons[enrollment.attendance]?.color || 'text-gray-400';
  const gradeColor = gradeColors[enrollment.performanceGrade] || 'text-gray-500';

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-800 mb-4">
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
        {isPast && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center text-sm">
              <AttendanceIcon className={cn('h-4 w-4 mr-2', attendanceColor)} />
              <span className={cn('font-medium', attendanceColor)}>{enrollment.attendance}</span>
            </div>
            <div className="flex items-center text-sm">
              <Star className={cn('h-4 w-4 mr-2', gradeColor)} />
              <span className={cn('font-medium', gradeColor)}>{enrollment.performanceGrade}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
