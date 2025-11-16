import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { StaffModel } from '../../../models/staffs/staff';
import { StudentModel } from '../../../models/students/student';
import { ApiResponse } from '../../../models/responses/response';

export interface JWTTokensDTO {
  access_token: string;
  refresh_token: string;
}

export interface JsonResponseDTO<T> {
  user: T;
  tokens: JWTTokensDTO;
}

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = API_URL + '/auth';
  constructor() {}
  private http = inject(HttpClient);

  login<T>(email: string, password: string): Observable<ApiResponse<JsonResponseDTO<T>>> {
    return this.http.post<ApiResponse<JsonResponseDTO<T>>>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  refreshToken(token: string): Observable<ApiResponse<JWTTokensDTO>> {
    return this.http.post<ApiResponse<JWTTokensDTO>>(
      `${this.apiUrl}/refresh-token`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
