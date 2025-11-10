import { Career } from '../../services/careers/career-service';
import { CareerModelRest } from '../careers/careers';

export interface createStudent {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export interface updateStudent {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export interface StudentModelRest {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careers: CareerModelRest[];
}
