import { inject, Injectable } from '@angular/core';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { ApplicationUserService } from '../../users/rest/application-user-service';
import { StaffService } from '../../staffs/rest/staff-service';
import { StudentService } from '../../students/rest/student-service';
import { UserModel } from '../../../models/users/user';

@Injectable({ providedIn: 'root' })
export class DeleteUserHandlerService {
  private snackBar = inject(SnackbarNotificationService);
  private staffService = inject(StaffService);
  private studentService = inject(StudentService);
  private staffRoles = ['MODERATOR', 'ADMIN', 'WRITER'];

  deleteUser(user: UserModel, reloadCallback: () => void): void {
    if (user.roles.map((r) => r.roleName.toUpperCase()).includes('STUDENT')) {
      this.studentService.delete(user.id).subscribe({
        next: () => {
          this.snackBar.success('Usuario estudiante eliminado correctamente');
          reloadCallback();
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Error al eliminar estudiante';
          this.snackBar.error(errorMsg);
        },
      });
    }

    if (
      this.staffRoles.some((role) => user.roles.map((r) => r.roleName.toUpperCase()).includes(role))
    ) {
      this.staffService.delete(user.id).subscribe({
        next: () => {
          this.snackBar.success('Usuario staff eliminado correctamente');
          reloadCallback();
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Error al eliminar staff';
          this.snackBar.error(errorMsg);
        },
      });
    }
  }
}
