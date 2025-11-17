import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/responses/response';
import { Role } from '../../models/users/user';
import { RoleVerificationModel } from '../../models/roles/roles';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = API_URL + '/roles';
  private apiUserUrl = API_URL + '/users';

  private http = inject(HttpClient);

  index(): Observable<ApiResponse<Role[]>> {
    return this.http.get<any>(this.apiUrl);
  }

  hasRole(userId: number, roleNames: string[]): Observable<ApiResponse<RoleVerificationModel>> {
    return this.http.post<any>(`${this.apiUserUrl}/${userId}/roles/verify`, { roleNames });
  }
}
