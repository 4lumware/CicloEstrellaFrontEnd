import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../consts/api';
import { HttpClient } from '@angular/common/http';
import { createStudent } from '../../models/students/student';

@Injectable({
  providedIn: 'root',
})
export class Students {
  private apiUrl = API_URL + '/students';
  private http = inject(HttpClient);

  update(studentId: number, student: createStudent) {
    return this.http.put(`${this.apiUrl}/${studentId}`, student);
  }
}
