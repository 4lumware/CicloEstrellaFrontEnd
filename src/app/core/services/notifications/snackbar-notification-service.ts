import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SnackbarConfig {
  duration?: number;
  panelClass?: string | string[];
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarNotificationService {
  private defaultConfig: SnackbarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['snackbar-default'],
  };

  private snackBar = inject(MatSnackBar);

  success(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-error'],
    });
  }

  info(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-info'],
    });
  }
}
