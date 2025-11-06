import { S } from '@angular/cdk/keycodes';
import { StaffModelCreate } from '../../models/staffs/staff';

export interface StaffModelRest {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  roleId: number;
}

export const StaffAdapterRest = (staff: StaffModelCreate): StaffModelRest => {
  return {
    username: staff.username,
    email: staff.email,
    password: staff.password,
    profilePictureUrl: staff.profilePictureUrl,
    roleId: staff.roleId,
  };
};
