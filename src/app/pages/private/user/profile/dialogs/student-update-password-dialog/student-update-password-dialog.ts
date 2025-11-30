import { Component, inject } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Input } from '../../../../../../shared/components/forms/input/input';
import { StudentService } from '../../../../../../core/services/students/rest/student-service';
import { StudentModel } from '../../../../../../core/models/students/student';
import { ApiResponse } from '../../../../../../core/models/responses/response';
import { SnackbarNotificationService } from '../../../../../../core/services/notifications/snackbar-notification-service';

export interface StudentUpdatePasswordForm {
  newPassword: FormControl<string>;
  oldPassword: FormControl<string>;
}
@Component({
  selector: 'app-student-update-password-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    Input,
    ReactiveFormsModule,
  ],
  templateUrl: './student-update-password-dialog.html',
  styleUrl: './student-update-password-dialog.css',
})
export class StudentUpdatePasswordDialog {
  private fb = inject(NonNullableFormBuilder);
  private studentService = inject(StudentService);
  readonly dialogRef = inject(MatDialogRef<StudentUpdatePasswordDialog>);
  protected passwordForm!: FormGroup<StudentUpdatePasswordForm>;
  readonly data = inject<{ studentId: string }>(MAT_DIALOG_DATA);
  private snackbarService = inject(SnackbarNotificationService);

  constructor() {
    this.passwordForm = this.fb.group<StudentUpdatePasswordForm>({
      newPassword: this.fb.control(''),
      oldPassword: this.fb.control(''),
    });
  }
  onClickUpdatePassword(): void {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.controls.newPassword.value;
      const oldPassword = this.passwordForm.controls.oldPassword.value;
      const studentId = this.data.studentId;
      this.studentService.updatePassword(studentId, newPassword, oldPassword).subscribe({
        next: (response: ApiResponse<StudentModel>) => {
          this.snackbarService.success('Contraseña actualizada con éxito');
          this.dialogRef.close(response.data);
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ||
            'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.';
          this.snackbarService.error(errorMessage);
          console.error('Error al actualizar la contraseña:', err);
        },
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
