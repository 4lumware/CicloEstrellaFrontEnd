import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../../models/responses/response';
import { API_URL } from '../../../constants/api';
import {
  StudentModel,
  StudentModelCreate,
  StudentModelCreateRest,
  StudentModelUpdate,
} from '../../../models/students/student';
import { AuthUserService, JsonResponseDTO } from '../../users/auth/auth-user-service';
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = API_URL + '/students';
  private storeStudentUrl = API_URL + '/auth/students/register';
  private http = inject(HttpClient);

  store(student: StudentModelCreateRest): Observable<ApiResponse<JsonResponseDTO<StudentModel>>> {
    return this.http.post<ApiResponse<JsonResponseDTO<StudentModel>>>(
      this.storeStudentUrl,
      student
    );
  }

  update(
    studentId: number,
    student: StudentModelCreateRest
  ): Observable<ApiResponse<StudentModel>> {
    return this.http.put<ApiResponse<StudentModel>>(`${this.apiUrl}/${studentId}`, student);
  }

  delete(studentId: number): Observable<ApiResponse<StudentModel>> {
    return this.http.delete<ApiResponse<StudentModel>>(`${this.apiUrl}/${studentId}`);
  }

  getById(studentId: number): Observable<ApiResponse<StudentModel>> {
    return this.http.get<ApiResponse<StudentModel>>(`${this.apiUrl}/${studentId}`);
  }
}
