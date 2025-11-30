import { Component, inject, signal, viewChild } from '@angular/core';
import { StudentProfileBasic } from '../student-profile-basic/student-profile-basic';
import { StudentService } from '../../../../../core/services/students/rest/student-service';
import {
  StudentModelCreateRest,
  StudentModelUpdate,
} from '../../../../../core/models/students/student';
import { ConfirmDialog } from '../../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarNotificationService } from '../../../../../core/services/notifications/snackbar-notification-service';
import { StudentUpdatePasswordDialog } from '../dialogs/student-update-password-dialog/student-update-password-dialog';

@Component({
  selector: 'app-student-profile',
  imports: [StudentProfileBasic],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfile {
  private studentService = inject(StudentService);
  private snackbar = inject(SnackbarNotificationService);
  private dialog = inject(MatDialog);
  private studentBasic = viewChild(StudentProfileBasic);
  onUpdateProfile(student: StudentModelUpdate & { studentId: number }): void {
    console.log('Actualizando perfil del estudiante:', student);
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar actualización',
        message: '¿Estás seguro de que deseas actualizar tu perfil?',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      },
    });

    const studentUpdate: StudentModelCreateRest = {
      username: student.username,
      email: student.email,
      password: student.password,
      profilePictureUrl: student.profilePictureUrl,
      currentSemester: student.currentSemester,
      careerIds: student.careerIds,
    };

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.studentService.update(student.studentId, studentUpdate).subscribe({
          next: (updatedStudent) => {
            console.log('Perfil actualizado con éxito:', updatedStudent);
            this.snackbar.success('Perfil actualizado con éxito.');
            this.studentBasic()?.loadStudent();
          },
          error: (error) => {
            this.snackbar.error('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
            console.error('Error al actualizar el perfil:', error);
          },
        });
      }
    });
  }

  onUpdatePassword(studentId: number): void {
    console.log('Abriendo diálogo para actualizar la contraseña del estudiante con ID:', studentId);
    const ref = this.dialog.open(StudentUpdatePasswordDialog, {
      data: { studentId: studentId },
      width: '400px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Contraseña actualizada para el estudiante con ID:', studentId);
      }
    });
  }
}
