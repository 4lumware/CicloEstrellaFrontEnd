export interface Role {
  id: number;
  roleName: string;
}

export interface UserModel {
  id: number;
  username: string;
  email: string;
  profilePictureUrl: string;
  creationDate: Date;
  state: boolean;
  roles: Role[];
}
