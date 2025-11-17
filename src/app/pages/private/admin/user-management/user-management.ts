import { Component, inject, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserCreateDialog } from './components/dialogs/user-create-dialog/user-create-dialog';
import { UserUpdateDialog } from './components/dialogs/user-update-dialog/user-update-dialog';
import { UserManagementTable } from './components/user-management-table/user-management-table';
import { UpdateUserHandlerService } from '../../../../core/services/users/logic/update-user-handler-service';
import { CreateUserHandlerService } from '../../../../core/services/users/logic/create-user-handler-service';
import { DeleteUserHandlerService } from '../../../../core/services/users/logic/delete-user-handler-service';
import { UserModel } from '../../../../core/models/users/user';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { StudentModelCreate } from '../../../../core/models/students/student';
import { StaffModelCreate } from '../../../../core/models/staffs/staff';
import { AuthUserService } from '../../../../core/services/users/auth/auth-user-service';

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
  private tableComponent = viewChild(UserManagementTable);
  private dialog = inject(MatDialog);
  private updateUserHandler = inject(UpdateUserHandlerService);
  private createUserHandler = inject(CreateUserHandlerService);
  private deleteUserHandler = inject(DeleteUserHandlerService);
  private authService = inject(AuthUserService);
  protected currentUser$ = this.authService.currentUser$;

  onAddUser(): void {
    const ref = this.dialog.open(UserCreateDialog, {
      data: {},
      width: '640px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe((result: StudentModelCreate | StaffModelCreate) => {
      if (!result) return;

      const tableComponent = this.tableComponent();

      if (!tableComponent) return;

      this.createUserHandler.createUser(result, () => tableComponent.loadUsers());
    });
  }

  onUserUpdate(user: UserModel): void {
    const ref = this.dialog.open(UserUpdateDialog, {
      data: { user },
      width: '640px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log('Usuario a actualizar:', result);
      const tableComponent = this.tableComponent();

      if (!tableComponent) return;

      this.updateUserHandler.updateUser(user.id, result, () => tableComponent.loadUsers());
    });
  }

  onUserDelete(user: UserModel): void {
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

    const tableComponent = this.tableComponent();

    if (!tableComponent) return;

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUserHandler.deleteUser(user, () => tableComponent.loadUsers());
      }
    });
  }
}
