import { inject, Injectable } from '@angular/core';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { AuthUserService } from '../../users/auth/auth-user-service';
import { ApplicationUserService } from '../../users/rest/application-user-service';

@Injectable({ providedIn: 'root' })
export class CreateUserHandlerService {
  private snackBar = inject(SnackbarNotificationService);
  private authService = inject(AuthUserService);
  private appUserService = inject(ApplicationUserService);

  private staffRoles: string[] = ['STAFF', 'ADMIN', 'TEACHER', 'COORDINATOR'];

  createUser(result: any, reloadCallback: () => void): void {
    const roleName: string = result.roleName;

    if (roleName === 'STUDENT') {
      // Validaciones específicas de estudiante
      if (!Array.isArray(result.careerIds) || result.careerIds.length === 0) {
        this.snackBar.error('Debe seleccionar al menos una carrera para estudiantes');
        return;
      }

      const payload: any = {
        username: result.username,
        email: result.email,
        password: result.password,
        currentSemester: result.currentSemester,
        careerIds: result.careerIds,
      };
      if (result.profilePictureUrl) payload.profilePictureUrl = result.profilePictureUrl;

      this.authService.registerStudent(payload).subscribe({
        next: () => {
          this.snackBar.success('Usuario estudiante creado correctamente');
          reloadCallback();
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Error al crear estudiante';
          this.snackBar.error(errorMsg);
        },
      });
      return;
    }

    if (this.staffRoles.includes(roleName)) {
      if (!result.roleId) {
        this.snackBar.error('Debe seleccionar un rol para el usuario staff');
        return;
      }

      const payload: any = {
        username: result.username,
        email: result.email,
        password: result.password,
        roleId: Number(result.roleId),
      };
      if (result.profilePictureUrl) payload.profilePictureUrl = result.profilePictureUrl;

      this.authService.registerStaff(payload).subscribe({
        next: () => {
          this.snackBar.success('Usuario staff creado correctamente');
          reloadCallback();
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Error al crear staff';
          this.snackBar.error(errorMsg);
        },
      });
      return;
    }

    // Otros roles (fallback)
    const payload: any = {
      username: result.username,
      email: result.email,
      password: result.password,
    };
    if (result.profilePictureUrl) payload.profilePictureUrl = result.profilePictureUrl;

    this.appUserService.store(payload).subscribe({
      next: () => {
        this.snackBar.success('Usuario creado correctamente');
        reloadCallback();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Error al crear usuario';
        this.snackBar.error(errorMsg);
      },
    });
  }
}
