import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../consts/api';
import { HttpClient } from '@angular/common/http';
import { createStudent } from '../../models/students/student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Students {
  private apiUrl = API_URL + '/students';
  private http = inject(HttpClient);

  update(studentId: number, student: createStudent) {
    return this.http.put(`${this.apiUrl}/${studentId}`, student);
  }

  delete(studentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${studentId}`);
  }

  getById(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${studentId}`);
  }
}
