import { inject, Injectable } from '@angular/core';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { ApplicationUserService } from '../../users/rest/application-user-service';

@Injectable({ providedIn: 'root' })
export class DeleteUserHandlerService {
  private snackBar = inject(SnackbarNotificationService);
  private appUserService = inject(ApplicationUserService);

  deleteUser(userId: number, reloadCallback: () => void): void {
    this.appUserService.delete(userId).subscribe({
      next: () => {
        this.snackBar.success('Usuario eliminado correctamente');
        reloadCallback();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Error al eliminar usuario';
        this.snackBar.error(errorMsg);
      },
    });
  }
}
