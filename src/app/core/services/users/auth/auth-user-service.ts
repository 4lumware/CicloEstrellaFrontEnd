import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { StaffModel } from '../../../models/staffs/staff';
import { StudentModel } from '../../../models/students/student';
import { ApiResponse } from '../../../models/responses/response';
import { AuthRefreshTokenService } from './auth-refresh-token-service';
import { AuthCurrentUserService } from './auth-current-user-service';

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
  private http = inject(HttpClient);
  private refreshService = inject(AuthRefreshTokenService);
  private currentUserService = inject(AuthCurrentUserService);

  login<T extends StaffModel | StudentModel>(
    email: string,
    password: string
  ): Observable<ApiResponse<JsonResponseDTO<T>>> {
    return this.http
      .post<ApiResponse<JsonResponseDTO<T>>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          const user = response.data.user;
          this.currentUserService.setCurrentUser(user as any);

          const tokens = response.data.tokens;

          this.refreshService.setTokens(tokens as any);
        })
      );
  }

  refreshToken(token: string): Observable<ApiResponse<JWTTokensDTO>> {
    return this.refreshService.refreshToken(token);
  }

  logout(): void {
    this.refreshService.clearTokens();
    this.currentUserService.logout();
  }

  public loadUserFromStorage() {
    return this.currentUserService.initialize();
  }

  setCurrentUser(user: StaffModel | StudentModel | null) {
    this.currentUserService.setCurrentUser(user);
  }
}
