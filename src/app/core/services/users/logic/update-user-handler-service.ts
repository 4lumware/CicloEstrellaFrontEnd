import { inject, Injectable } from '@angular/core';
import { StudentUpdateService } from '../../students/logic/student-update-service';
import { StaffUpdateService } from '../../staffs/logic/staff-update-service';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { StudentModelCreate } from '../../../models/students/student';
import { StaffModelCreate } from '../../../models/staffs/staff';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserHandlerService {
  private studentUpdateService = inject(StudentUpdateService);
  private staffUpdateService = inject(StaffUpdateService);
  private snackBar = inject(SnackbarNotificationService);
  private staffRoles: string[] = ['WRITER', 'ADMIN', 'MODERATOR'];

  updateUser(
    userId: number,
    result: StudentModelCreate | StaffModelCreate,
    reloadCallback: () => void
  ): void {
    const type = result.type;
    console.log('Tipo de usuario a actualizar:', type);
    const handlers: Record<string, () => void> = {
      STUDENT: () => {
        const student = result as StudentModelCreate;
        this.studentUpdateService.update(userId, student).subscribe({
          next: () => {
            this.snackBar.success('Usuario estudiante actualizado correctamente');
            reloadCallback();
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Error al actualizar estudiante';
            this.snackBar.error(errorMsg);
          },
        });
      },
    };

    this.staffRoles.forEach((role) => {
      handlers[role] = () => {
        const staff = result as StaffModelCreate;
        this.staffUpdateService.update(userId, staff).subscribe({
          next: () => {
            this.snackBar.success('Usuario staff actualizado correctamente');
            reloadCallback();
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Error al actualizar staff';
            this.snackBar.error(errorMsg);
          },
        });
      };
    });

    const handler = handlers[type];
    if (handler) handler();
    else this.snackBar.error(`No existe un handler para el rol ${type}`);
  }
}
