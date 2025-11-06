import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../consts/api';
import { HttpClient } from '@angular/common/http';
import { createStudent, StudentModelRest } from '../../../models/students/student';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../careers/career-service';

@Injectable({
  providedIn: 'root',
})
export class Students {
  private apiUrl = API_URL + '/students';
  private http = inject(HttpClient);

  update(studentId: number, student: createStudent): Observable<ApiResponse<StudentModelRest>> {
    return this.http.put<ApiResponse<StudentModelRest>>(`${this.apiUrl}/${studentId}`, student);
  }

  delete(studentId: number): Observable<ApiResponse<StudentModelRest>> {
    return this.http.delete<ApiResponse<StudentModelRest>>(`${this.apiUrl}/${studentId}`);
  }

  getById(studentId: number): Observable<ApiResponse<StudentModelRest>> {
    return this.http.get<ApiResponse<StudentModelRest>>(`${this.apiUrl}/${studentId}`);
  }
}
