import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Progress } from './ui/Progress';
import { Mail } from 'lucide-react';

interface StudentProgressCardProps {
  student: User;
}

export default function StudentProgressCard({ student }: StudentProgressCardProps) {
  const progress = (student.totalCompletedHours / 200) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.fullName}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Mail className="h-4 w-4 mr-2" />
          <span>{student.email}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Completed Hours</span>
            <span className="text-sm font-bold">{student.totalCompletedHours} / 200</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="text-right text-xs text-gray-500">
          {progress.toFixed(0)}% Complete
        </div>
      </CardContent>
    </Card>
  );
}
