import { TagModel } from '../tags/tags';
import { TeacherModel } from '../teachers/teacher';

export interface StudentReviewModel {
  id: number;
  username: string;
  profilePictureUrl: string;
}

export interface ReviewsModelCreate {}

export interface ReviewModelUpdate {}

export interface ReactionModel {
  id: number;
  reactionName: string;
  icon_url: string;
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

export interface CreateReviewRequest {
  description: string;
  rating: number;
  teacherId: number;
  tagIds: number[];
}

export interface UpdateReviewRequest {
  description: string;
  rating: number;
  tagIds: number[];
}

export interface ReviewModalData {
  teacherId: number;
  teacherName: string;
  review?: ReviewModel;
  availableTags: TagModel[];
}

export interface ReviewModalResult {
  description: string;
  rating: number;
  tagIds: number[];
}

export interface ReviewReactionModel {
  id: number;
  author: StudentReviewModel;
  reaction: ReactionModel;
  createdAt: string;
}

export interface ReactionCountModel {
  reaction: ReactionModel;
  count: number;
  userReacted: boolean; // Si el usuario actual reaccionó con esta
  userReactionId?: number; // ID de la reacción del usuario (para eliminar)
}

export interface ReactionEvent {
  reviewId: number;
  reactionId: number;
  reviewReactionId?: number;
}

export interface ReactionSummary {
  id: number;
  reactionName: string;
  icon_url: string;
  count: number;
  userReacted?: boolean;
  userReactionId?: number;
}
