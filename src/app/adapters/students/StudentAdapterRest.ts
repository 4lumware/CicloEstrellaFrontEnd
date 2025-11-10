import { createStudent } from '../../models/students/student';
export interface StudentCreateModelRest {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export const StudentAdapterRest = (student: createStudent): StudentCreateModelRest => {
  return {
    username: student.username,
    email: student.email,
    password: student.password,
    profilePictureUrl: student.profilePictureUrl,
    currentSemester: student.currentSemester,
    careerIds: student.careerIds,
  };
};
