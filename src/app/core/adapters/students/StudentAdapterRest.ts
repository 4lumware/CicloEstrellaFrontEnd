import { StudentModelCreate, StudentModelCreateRest } from '../../models/students/student';

export const StudentAdapterRest = (student: StudentModelCreate): StudentModelCreateRest => {
  return {
    username: student.username,
    email: student.email,
    password: student.password,
    profilePictureUrl: student.profilePictureUrl,
    currentSemester: student.currentSemester,
    careerIds: student.careerIds,
  };
};
