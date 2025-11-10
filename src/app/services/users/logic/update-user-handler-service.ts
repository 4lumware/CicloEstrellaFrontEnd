import { inject, Injectable } from '@angular/core';
import { StudentUpdateService } from '../../students/logic/student-update-service';
import { StaffUpdateService } from '../../staffs/logic/staff-update-service';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserHandlerService {
  private studentUpdateService = inject(StudentUpdateService);
  private staffUpdateService = inject(StaffUpdateService);
  private snackBar = inject(SnackbarNotificationService);
  private staffRoles: string[] = ['STAFF', 'ADMIN', 'TEACHER', 'COORDINATOR'];

  updateUser(userId: number, result: any, reloadCallback: () => void): void {
    const roleName = result.roleName;

    const handlers: Record<string, () => void> = {
      STUDENT: () => {
        this.studentUpdateService.update(userId, result).subscribe({
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
        this.staffUpdateService.update(userId, result).subscribe({
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

    // Ejecutar handler según el rol
    const handler = handlers[roleName];
    if (handler) handler();
    else this.snackBar.error(`No existe un handler para el rol ${roleName}`);
  }
}
