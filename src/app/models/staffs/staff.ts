export interface StaffModelCreate {
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
  roleId: number;
}
