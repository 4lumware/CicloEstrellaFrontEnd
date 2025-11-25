import { CampusModel } from '../campuses/campuses';
import { CareerModel } from '../careers/careers';
import { CourseModel } from '../courses/courses';

export interface TeacherModel {
  id: number;
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  averageRating: number;
  careers: CareerModel[];
  campuses: CampusModel[];
  courses: CourseModel[];
}

export interface TeacherModelCreate {
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  averageRating: number;
  career: CareerModel[];
  campuses: CampusModel[];
  courses: CourseModel[];
}

export interface TeacherModelUpdate {
  firstName: string;
  lastName: string;
  generalDescription: string;
  profilePictureUrl: string;
  averageRating: number;
  career: CareerModel[];
  campuses: CampusModel[];
  courses: CourseModel[];
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
