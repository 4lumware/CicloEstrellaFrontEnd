import { StudentModel } from '../students/student';

export interface TeacherRequestParamsFilter {
  studentName: string;
  startDate: string;
  endDate: string;
  teacherName: string;
  courseId: number | null;
  campusId: number | null;
  page: number;
  size: number;
}

export interface RequestContentModel<T> {
  id: string;
  student: StudentModel;
  requestType: string;
  content: T;
  status: string;
  createdAt: Date;
}

export type RequestType = 'TEACHER';
export interface RequestModelCreate<T> {
  requestType: RequestType;
  content: T;
}
