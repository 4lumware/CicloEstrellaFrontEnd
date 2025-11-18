import { inject, Injectable } from '@angular/core';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { StudentService } from '../../students/rest/student-service';
import { StaffService } from '../../staffs/rest/staff-service';
import { StaffModelCreate, StaffModelCreateRest } from '../../../models/staffs/staff';
import {
  StudentModel,
  StudentModelCreate,
  StudentModelCreateRest,
} from '../../../models/students/student';
import { StudentAdapterRest } from '../../../adapters/students/StudentAdapterRest';
import { StaffAdapterRest } from '../../../adapters/staffs/StaffAdapterRest';

@Injectable({ providedIn: 'root' })
export class CreateUserHandlerService {
  private snackBar = inject(SnackbarNotificationService);
  private studentService = inject(StudentService);
  private staffService = inject(StaffService);
  private staffRoles: string[] = ['WRITER', 'ADMIN', 'MODERATOR'];

  createUser(result: StudentModelCreate | StaffModelCreate, reloadCallback: () => void): void {
    const type = result.type;
    console.log('Tipo de usuario a crear:', type);
    if (type === 'STUDENT') {
      const student = result as StudentModelCreate;

      if (!Array.isArray(student.careerIds) || student.careerIds.length === 0) {
        this.snackBar.error('Debe seleccionar al menos una carrera para estudiantes');
        return;
      }

      const payload: StudentModelCreateRest = StudentAdapterRest(student);

      this.studentService.store(payload).subscribe({
        next: () => {
          this.snackBar.success('Usuario estudiante creado correctamente');
          reloadCallback();
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Error al crear estudiante';
          this.snackBar.error(errorMsg);
        },
      });
    }

    if (this.staffRoles.includes(type)) {
      if (!('roleId' in result)) {
        this.snackBar.error('Debe seleccionar un rol para el usuario staff');
        return;
      }

      const payload: StaffModelCreateRest = StaffAdapterRest(result);

      this.staffService.store(payload).subscribe({
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
  }
}
