import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private _currentUser = new BehaviorSubject<StaffModel | StudentModel | null>(null);

  public readonly currentUser$ = this._currentUser.asObservable();

  private apiUrl = API_URL + '/auth';
  private http = inject(HttpClient);

  login<T extends StaffModel | StudentModel>(
    email: string,
    password: string
  ): Observable<ApiResponse<JsonResponseDTO<T>>> {
    return this.http
      .post<ApiResponse<JsonResponseDTO<T>>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          const user = response.data.user;
          this._currentUser.next(user);
          const tokens = response.data.tokens;

          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
        })
      );
  }

  refreshToken(token: string): Observable<ApiResponse<JWTTokensDTO>> {
    return this.http.post<ApiResponse<JWTTokensDTO>>(
      `${this.apiUrl}/refresh-token`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  logout(): void {
    this._currentUser.next(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
