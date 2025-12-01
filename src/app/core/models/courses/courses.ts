import { FormatModel } from '../formats/formats';

export interface CourseModel {
  id: number;
  courseName: string;
  formats: FormatModel[];
}
