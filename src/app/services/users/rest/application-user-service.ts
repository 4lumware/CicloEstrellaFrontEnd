import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../consts/api';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../careers/career-service';
import { Observable } from 'rxjs';
import { createStaff, User } from '../../../models/users/user';
import { createStudent } from '../../../models/students/student';
import { StaffModelRest } from '../../../adapters/staffs/StaffAdapterRest';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  private apiUrl = API_URL + '/users';
  private storeUserUrl = API_URL + '/auth/staffs/register';

  private http = inject(HttpClient);

  index(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}`, {
      params: { page: page.toString(), size: size.toString() },
    });
  }

  store(user: createStaff | FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.storeUserUrl}`, user);
  }

  delete(userId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${userId}`);
  }

  update(userId: number, user: createStaff | FormData): Observable<ApiResponse<StaffModelRest>> {
    return this.http.put<ApiResponse<StaffModelRest>>(`${this.apiUrl}/${userId}`, user);
  }
}
