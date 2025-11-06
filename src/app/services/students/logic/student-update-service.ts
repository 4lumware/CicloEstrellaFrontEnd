import { inject, Injectable } from '@angular/core';
import { SnackbarNotificationService } from '../../notifications/snackbar-notification-service';
import { Students } from '../rest/students';

import { createStudent, StudentModelRest, updateStudent } from '../../../models/students/student';
import { Observable } from 'rxjs';
import { StudentAdapterRest } from '../../../adapters/students/StudentAdapterRest';
import { ApiResponse } from '../../careers/career-service';

@Injectable({
  providedIn: 'root',
})
export class StudentUpdateService {
  private studentService = inject(Students);

  update(userId: number, data: updateStudent): Observable<ApiResponse<StudentModelRest>> {
    const studentAdapter = StudentAdapterRest(data);
    return this.studentService.update(userId, studentAdapter);
  }
}
