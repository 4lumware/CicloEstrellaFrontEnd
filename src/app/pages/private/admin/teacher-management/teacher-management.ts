import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeacherManagementTable } from './components/teacher-management-table/teacher-management-table';
import { TeacherCreateDialog } from './components/dialogs/teacher-create-dialog/teacher-create-dialog';
import { TeacherUpdateDialog } from './components/dialogs/teacher-update-dialog/teacher-update-dialog';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { TeacherModel } from '../../../../core/models/teachers/teacher';
import { TeacherService } from '../../../../core/services/teachers/teachers-service';
import { ApiResponse } from '../../../../core/models/responses/response';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-teacher-management',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    TeacherManagementTable,
  ],
  templateUrl: './teacher-management.html',
  styleUrl: './teacher-management.css',
})
export class TeacherManagement {
  private tableComponent = viewChild(TeacherManagementTable);
  private dialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private teacherService = inject(TeacherService);

  onAddTeacher(): void {
    const ref = this.dialog.open(TeacherCreateDialog, { width: '700px', maxHeight: '90vh' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const table = this.tableComponent();
      if (!table) return;

      this.teacherService.store(result).subscribe({
        next: (response: ApiResponse<TeacherModel>) => {
          const createdTeacher = response.data;
          this.snackBar.open(
            `Profesor ${createdTeacher.firstName + ' ' + createdTeacher.lastName} creado`,
            'Cerrar',
            {
              duration: 3000,
            }
          );
          table.loadRequests();
        },
        error: () => this.snackBar.open('Error creando profesor', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onTeacherUpdate(teacher: TeacherModel): void {
    const ref = this.dialog.open(TeacherUpdateDialog, {
      data: { teacher },
      width: '640px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const table = this.tableComponent();
      if (!table) return;

      this.teacherService.update(teacher.id, result).subscribe({
        next: () => {
          this.snackBar.open('Profesor actualizado', 'Cerrar', { duration: 3000 });
          table.loadRequests();
        },
        error: () =>
          this.snackBar.open('Error actualizando profesor', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onTeacherDelete(teacher: TeacherModel): void {
    const table = this.tableComponent();
    if (!table) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar Profesor(es)',
        message: `¿Está seguro de que desea eliminar ${teacher.firstName} ${teacher.lastName}? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_forever',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.teacherService.destroy(teacher.id).subscribe({
        next: () => {
          this.snackBar.open(`Profesor eliminado`, 'Cerrar', { duration: 3000 });
          table.loadRequests();
        },
        error: () => this.snackBar.open('Error eliminando profesor', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onTeacherDeleteMultiple(teachers: TeacherModel[]): void {
    console.log('onTeacherDeleteMultiple called with', teachers);
    const table = this.tableComponent();
    if (!table) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar Profesor(es)',
        message: `¿Está seguro de que desea eliminar ${teachers.length} profesores? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_forever',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      const requests = teachers.map((t) => this.teacherService.destroy(t.id));

      forkJoin(requests).subscribe({
        next: () => {
          table.loadRequests();
          this.snackBar.open(`${teachers.length}  Profesores eliminados correctamente`, 'Cerrar', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('Error eliminando profesor(es)', 'Cerrar', { duration: 3000 });
        },
      });
    });
  }
}
