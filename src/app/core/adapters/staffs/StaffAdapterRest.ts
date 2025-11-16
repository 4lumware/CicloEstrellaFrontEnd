import { S } from '@angular/cdk/keycodes';
import { StaffModelCreate, StaffModelCreateRest } from '../../models/staffs/staff';

export const StaffAdapterRest = (staff: StaffModelCreate): StaffModelCreateRest => {
  return {
    username: staff.username,
    email: staff.email,
    password: staff.password,
    profilePictureUrl: staff.profilePictureUrl,
    roleId: staff.roleId,
  };
};
