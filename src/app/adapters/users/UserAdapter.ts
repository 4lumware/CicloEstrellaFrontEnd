import { createStaff, User } from '../../models/users/user';
interface StaffModel {
  username: string;
  email: string;
  password: string;
  profilePictureUrl: string;
}
export const UserAdapter = (user: createStaff): StaffModel => {
  return {
    username: user.username,
    email: user.email,
    password: user.password,
    profilePictureUrl: user.profilePictureUrl,
  };
};
