import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/responses/response';
import { Role } from '../../models/users/user';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = API_URL + '/roles';

  private http = inject(HttpClient);

  index(): Observable<ApiResponse<Role[]>> {
    return this.http.get<any>(this.apiUrl);
  }
}
