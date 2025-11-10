import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserCreateDialog } from './components/dialogs/user-create-dialog/user-create-dialog';
import { UserUpdateDialog } from './components/dialogs/user-update-dialog/user-update-dialog';
import { UserManagementTable } from './components/user-management-table/user-management-table';
import { User } from '../../../../models/users/user';
import { ApplicationUserService } from '../../../../services/users/rest/application-user-service';
import { AuthUserService } from '../../../../services/users/auth/auth-user-service';
import { ConfirmDialog } from '../../../../components/ui/confirm-dialog/confirm-dialog';
import { SnackbarNotificationService } from '../../../../services/notifications/snackbar-notification-service';
import { UpdateUserHandlerService } from '../../../../services/users/logic/update-user-handler-service';
import { CreateUserHandlerService } from '../../../../services/users/logic/create-user-handler-service';
import { DeleteUserHandlerService } from '../../../../services/users/logic/delete-user-handler-service';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    UserManagementTable,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
  @ViewChild(UserManagementTable) tableComponent!: UserManagementTable;

  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarNotificationService);
  private userService = inject(ApplicationUserService);
  private authService = inject(AuthUserService);
  private updateUserHandler = inject(UpdateUserHandlerService);
  private createUserHandler = inject(CreateUserHandlerService);
  private deleteUserHandler = inject(DeleteUserHandlerService);

  onAddUser(): void {
    const ref = this.dialog.open(UserCreateDialog, {
      data: {},
      width: '640px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.createUserHandler.createUser(result, () => this.tableComponent.loadUsers());
    });
  }

  onUserUpdate(user: User): void {
    const ref = this.dialog.open(UserUpdateDialog, {
      data: { user },
      width: '640px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log('Usuario a actualizar:', result);

      this.updateUserHandler.updateUser(user.id, result, () => this.tableComponent.loadUsers());
    });
  }

  onUserDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro de que desea eliminar al usuario "${user.username}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_forever',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUserHandler.deleteUser(user.id, () => this.tableComponent.loadUsers());
      }
    });
  }
}
