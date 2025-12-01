import { Role } from '../users/user';

export interface StaffModelCreate {
  type: string;
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  roleId: number;
}

export interface StaffModelCreateRest {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  roleId: number;
}

export interface StaffModelUpdate {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  roleId: number;
}

export interface StaffModel {
  id: number;
  username: string;
  email: string;
  profilePictureUrl: string;
  creationDate: Date;
  state: boolean;
  roles: Role[];
}
