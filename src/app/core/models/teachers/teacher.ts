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
  career: CareerModel[];
  campuses: CampusModel[];
  courses: CourseModel[];
}
