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
import { ApplicationUserService } from '../../../../services/users/application/application-user-service';
import { AuthUserService } from '../../../../services/users/auth/auth-user-service';
import { UserAdapter } from '../../../../adapters/users/UserAdapter';
import { Students } from '../../../../services/students/students';
import { ConfirmDialog } from '../../../../components/ui/confirm-dialog/confirm-dialog';

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
  private snackBar = inject(MatSnackBar);
  private userService = inject(ApplicationUserService);
  private studentService = inject(Students);
  private authService = inject(AuthUserService);

  onAddUser(): void {
    const ref = this.dialog.open(UserCreateDialog, {
      data: {},
      width: '640px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log('Nuevo usuario a crear:', result);

      const roleName = result.roleName;
      const isStudent = roleName === 'STUDENT';
      const isStaff = ['ADMIN', 'MODERATOR', 'WRITER'].includes(roleName);

      // Construir el payload según el tipo de usuario
      const payload: any = {
        username: result.username,
        email: result.email,
        password: result.password,
      };

      // Agregar profilePictureUrl si existe (por ahora como base64, idealmente debería ser File)
      if (result.profilePictureUrl) {
        payload.profilePictureUrl = result.profilePictureUrl;
      }

      // No incluir roleId para estudiantes. Se agregará solo en la rama de staff.

      // Agregar campos específicos de estudiante
      if (isStudent) {
        if (result.currentSemester) {
          payload.currentSemester = result.currentSemester;
        }
        if (result.careerIds && Array.isArray(result.careerIds) && result.careerIds.length > 0) {
          payload.careerIds = result.careerIds;
        }
      }

      if (isStudent) {
        console.log('Payload a enviar (student):', payload, 'roleId:', payload.roleId);
        // Validar que los campos requeridos de estudiante estén presentes
        if (!payload.careerIds || payload.careerIds.length === 0) {
          this.snackBar.open('Debe seleccionar al menos una carrera para estudiantes', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          return;
        }

        // Registrar estudiante
        this.authService.registerStudent(payload).subscribe({
          next: (response) => {
            console.log('Estudiante creado:', response);
            this.snackBar.open('Estudiante creado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            console.error('Error al crear estudiante', err);
            const errorMsg = err.error?.message || 'Error al crear estudiante';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      } else if (isStaff) {
        // Validar roleId requerido por backend para staff
        if (!result.roleId) {
          this.snackBar.open('Debe seleccionar un rol válido para el staff', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          return;
        }

        payload.roleId = Number(result.roleId);

        this.authService.registerStaff(payload).subscribe({
          next: (response) => {
            console.log('Staff creado:', response);
            this.snackBar.open('Usuario staff creado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Error al crear estudiante';

            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      } else {
        // Usar el endpoint original para otros roles
        this.userService.store(payload).subscribe({
          next: (user) => {
            this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            console.error('Error al crear usuario', err);
            this.snackBar.open('Error al crear usuario', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  onUserUpdate(user: User): void {
    const ref = this.dialog.open(UserUpdateDialog, {
      data: { user: user },
      width: '640px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log('Usuario a actualizar:', result);

      const roleName = result.roleName;
      const isStudent = roleName === 'STUDENT';
      const isStaff = ['ADMIN', 'MODERATOR', 'WRITER'].includes(roleName);
      const wasStudent = result.wasStudent; // Flag que indica si era estudiante antes

      // Construir el payload según el tipo de usuario
      const payload: any = {
        username: result.username,
        email: result.email,
      };

      // Incluir password si se proporciona
      if (result.password) {
        payload.password = result.password;
      }

      // Agregar profilePictureUrl si existe
      if (result.profilePictureUrl) {
        payload.profilePictureUrl = result.profilePictureUrl;
      }

      // Agregar campos específicos de estudiante
      if (isStudent) {
        if (result.currentSemester) {
          payload.currentSemester = result.currentSemester;
        }
        if (result.careerIds && Array.isArray(result.careerIds) && result.careerIds.length > 0) {
          payload.careerIds = result.careerIds;
        }
      }

      console.log('Payload a enviar para actualizar (pre-branch):', payload);

      // Si era estudiante y ahora es staff/admin, primero eliminar la cuenta de estudiante
      if (wasStudent && isStaff) {
        console.log('Conversión de estudiante a staff/admin detectada');

        // Eliminar la cuenta de estudiante
        this.studentService.delete(user.id).subscribe({
          next: () => {
            console.log('Cuenta de estudiante eliminada');

            // Crear nueva cuenta de staff con los datos actualizados
            // Validar roleId requerido por backend para staff
            if (!result.roleId) {
              this.snackBar.open('Debe seleccionar un rol válido para el staff', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
              return;
            }

            // Validar contraseña para creación de staff
            if (!payload.password || payload.password.trim() === '') {
              this.snackBar.open('La contraseña es requerida para crear staff', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
              return;
            }

            payload.roleId = Number(result.roleId);

            console.log(
              'Payload a enviar (convert student->staff):',
              payload,
              'roleId:',
              payload.roleId
            );
            this.authService.registerStaff(payload).subscribe({
              next: (response) => {
                console.log('Nuevo staff creado:', response);
                this.snackBar.open('Usuario convertido a staff correctamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
                });
                this.tableComponent.loadUsers();
              },
              error: (err) => {
                console.error('Error al crear staff', err);
                const errorMsg =
                  err.error?.message || 'Error al crear staff después de eliminar estudiante';
                this.snackBar.open(errorMsg, 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
                });
              },
            });
          },
          error: (err) => {
            console.error('Error al eliminar cuenta de estudiante', err);
            const errorMsg = err.error?.message || 'Error al eliminar cuenta de estudiante';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
        return; // Salir temprano ya que el flujo es diferente
      }

      // Flujo normal de actualización
      if (isStudent) {
        // Validar que los campos requeridos de estudiante estén presentes
        if (!payload.careerIds || payload.careerIds.length === 0) {
          this.snackBar.open('Debe seleccionar al menos una carrera para estudiantes', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          return;
        }

        // Actualizar estudiante
        this.studentService.update(user.id, payload).subscribe({
          next: (response) => {
            console.log('Estudiante actualizado:', response);
            this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            console.error('Error al actualizar estudiante', err);
            const errorMsg = err.error?.message || 'Error al actualizar estudiante';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      } else if (isStaff) {
        // Incluir roleId si viene en el resultado
        if (result.roleId) {
          payload.roleId = result.roleId;
        }

        this.userService.update(user.id, payload).subscribe({
          next: (response) => {
            console.log('Staff actualizado:', response);
            this.snackBar.open('Usuario staff actualizado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            console.error('Error al actualizar staff', err);
            const errorMsg = err.error?.message || 'Error al actualizar staff';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      } else {
        // Actualizar otros tipos de usuarios
        this.userService.update(user.id, payload).subscribe({
          next: (response) => {
            console.log('Usuario actualizado:', response);
            this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err) => {
            console.error('Error al actualizar usuario', err);
            const errorMsg = err.error?.message || 'Error al actualizar usuario';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  onUserDelete(user: User): void {
    // Abrir diálogo de confirmación
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
        // Usuario confirmó la eliminación
        this.userService.delete(user.id).subscribe({
          next: (response: any) => {
            console.log('Usuario eliminado:', response);
            this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.tableComponent.loadUsers(); // Recargar la tabla
          },
          error: (err: any) => {
            console.error('Error al eliminar usuario', err);
            const errorMsg = err.error?.message || 'Error al eliminar usuario';
            this.snackBar.open(errorMsg, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }
}
