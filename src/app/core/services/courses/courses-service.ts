import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/responses/response';
import { CourseModel } from '../../models/courses/courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = API_URL + '/courses';

  private http = inject(HttpClient);

  index(): Observable<ApiResponse<CourseModel[]>> {
    return this.http.get<ApiResponse<CourseModel[]>>(this.apiUrl);
  }
}
