import { FormalityModel } from '../formalities/formality';

export interface AuthorComment {
  id: number;
  username: string;
  profilePictureUrl: string;
}

export interface CommentModel {
  id: number;
  author: AuthorComment;
  formality: FormalityModel;
  text: string;
  createdAt: Date;
}

export interface CommentCreateModel {
  text: string;
}

export interface CommentParamsFilter {
  keyword?: string;
  studentName?: string;
  formalityTitle?: string;
  from?: Date;
  to?: Date;
  page?: number;
  size?: number;
}
