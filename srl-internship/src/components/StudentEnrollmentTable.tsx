import { Enrollment, User, EnrollmentStatus } from '../types';

interface StudentEnrollmentTableProps {
  enrollments: (Enrollment & { student: User })[];
  onStatusChange: (enrollmentId: number, newStatus: EnrollmentStatus) => void;
}

export default function StudentEnrollmentTable({ enrollments, onStatusChange }: StudentEnrollmentTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.student.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.student.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.enrollmentStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <select 
                  value={enrollment.enrollmentStatus}
                  onChange={(e) => onStatusChange(enrollment.id, e.target.value as EnrollmentStatus)}
                  className="border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.values(EnrollmentStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
