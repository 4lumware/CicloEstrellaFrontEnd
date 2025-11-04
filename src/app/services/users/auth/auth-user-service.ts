import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../consts/api';
import { ApiResponse } from '../../../models/responses/response';

export interface JWTTokensDTO {
  access_token: string;
  refresh_token: string;
}

export interface JsonResponseDTO {
  user: UserDTO; // puede ser StudentResponseDTO o StaffResponseDTO
  tokens: JWTTokensDTO;
}

interface Role {
  id: number;
  roleName: string;
}

export interface UserDTO {
  id: number;
  email: string;
  roles: Role[];
}

export interface StudentResponseDTO extends UserDTO {
  firstName: string;
  lastName: string;
  career: string;
}

export interface StaffResponseDTO extends UserDTO {
  position: string;
  department?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = API_URL + '/auth';
  constructor() {}
  private http = inject(HttpClient);
  login(email: string, password: string): Observable<ApiResponse<JsonResponseDTO>> {
    return this.http.post<ApiResponse<JsonResponseDTO>>(`${this.apiUrl}/login`, {
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

  registerStudent(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/students/register`, data);
  }

  registerStaff(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/staffs/register`, data);
  }
}
