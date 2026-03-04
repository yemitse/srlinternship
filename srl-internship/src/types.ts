export type UserRole = 'Internship Coordinator' | 'Supervisor' | 'Student' | 'Pending';

export interface User {
  id: number;
  name: string;
  chinese_name?: string;
  student_id_num?: string;
  email: string;
  role: UserRole;
  status?: 'Pending' | 'Active' | 'Rejected';
  profile_picture?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  supervisor_id: number;
  supervisor_name?: string;
  slots: number;
  status: 'Open for Enrollment' | 'Enrollment Closed' | 'Completed' | 'Cancelled';
}

export interface EventSession {
  id: number;
  event_id: number;
  event_title?: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  hours: number;
}

export interface Enrollment {
  id: number;
  student_id: number;
  student_name?: string;
  student_email?: string;
  event_id: number;
  status: 'Pending' | 'Accepted' | 'Waitlisted' | 'Rejected' | 'Withdrawal';
}

export interface AttendanceRecord {
  id?: number;
  enrollment_id: number;
  session_id: number;
  student_name?: string;
  status: 'Not Marked' | 'Present' | 'Late' | 'Sick Leave' | 'No Show';
  planning_score?: number;
  executing_score?: number;
  grade?: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  notes?: string;
}

export interface StudentStats {
  enrolledHours: number;
  completedHours: number;
}
