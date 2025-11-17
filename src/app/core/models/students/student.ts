import { CareerModelRest } from '../careers/careers';

export interface StudentModelCreate {
  type: string;
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export interface StudentModelCreateRest {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export interface StudentModelUpdate {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careerIds: number[];
}

export interface StudentModel {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  currentSemester: number;
  careers: CareerModelRest[];
}
