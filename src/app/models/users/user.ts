export interface Role {
  id: number;
  roleName: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profilePictureUrl: string;
  creationDate: Date;
  state: boolean;
  roles: Role[];
}

export interface createStaff {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
}
