import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { StudentAdapterRest } from '../../../adapters/students/StudentAdapterRest';
import {
  StudentModel,
  StudentModelCreate,
  StudentModelUpdate,
} from '../../../models/students/student';
import { StudentService } from '../rest/student-service';
import { ApiResponse } from '../../../models/responses/response';
@Injectable({
  providedIn: 'root',
})
export class StudentUpdateService {
  private studentService = inject(StudentService);

  update(userId: number, data: StudentModelCreate): Observable<ApiResponse<StudentModel>> {
    const studentAdapter = StudentAdapterRest(data);
    return this.studentService.update(userId, studentAdapter);
  }
}
