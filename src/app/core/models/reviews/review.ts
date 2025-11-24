import { TagModel } from '../tags/tags';
import { TeacherModel } from '../teachers/teacher';

export interface StudentReviewModel {
  id: number;
  username: string;
  profilePictureUrl: string;
}

export interface ReviewsModelCreate {}

export interface ReviewModelUpdate {}

export interface ReactionCountModel {
  id: number;
  reactionName: string;
  icon_url: string;
  count: number;
}
export interface ReviewModel {
  id: number;
  description: string;
  rating: number;
  student: StudentReviewModel;
  teacher: TeacherModel;
  tags: TagModel[];
  reactions: ReactionCountModel[];
  createdAt: Date;
}

export interface ReviewParamsFilter {
  keyword?: string;
  studentId?: number | null;
  teacherId?: number | null;
  teacherName?: string;
  studentName?: string;
  minRating?: number | null;
  maxRating?: number | null;
  tagId?: number | null;
  tagName?: string;
  from?: Date | null;
  to?: Date | null;
  page?: number;
  size?: number;
}
