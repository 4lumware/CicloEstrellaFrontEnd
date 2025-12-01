import { CampusModel } from '../campuses/campuses';
import { CareerModel } from '../careers/careers';
import { CourseModel } from '../courses/courses';
import {TagModel} from '../tags/tags';

export interface TeacherModel {
  id: number;
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  averageRating: number;
  tags: TagModel[];
  careers: CareerModel[];
  campuses: CampusModel[];
  courses: CourseModel[];
}

export interface TeacherModelCreate {
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  careerIds: number[];
  campusIds: number[];
  courseIds: number[];
}

export interface TeacherModelUpdate {
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  careerIds: number[];
  campusIds: number[];
  courseIds: number[];
}

export interface TeacherParamsFilter {
  fullName?: string;
  minRating?: number | null;
  maxRating?: number | null;
  careerIds?: number[] | null;
  courseIds?: number[] | null;
  campusIds?: number[] | null;
  page?: number;
  size?: number;
}

export interface TeacherSearchFilter {
  name?: string;
  campus?: string;
  career?: string;
  course?: string;
}


