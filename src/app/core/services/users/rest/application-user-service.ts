import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { ApiResponse } from '../../../models/responses/response';
import { UserModel } from '../../../models/users/user';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  private apiUrl = API_URL + '/users';

  private http = inject(HttpClient);

  index(page: number = 0, size: number = 10): Observable<ApiResponse<UserModel[]>> {
    return this.http.get<ApiResponse<UserModel[]>>(`${this.apiUrl}`, {
      params: { page: page.toString(), size: size.toString() },
    });
  }
}
