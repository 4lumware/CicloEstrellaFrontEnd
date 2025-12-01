import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { ApiResponse } from '../../../models/responses/response';

export interface JWTTokensDTO {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthRefreshTokenService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/auth';

  refreshToken(token: string): Observable<ApiResponse<JWTTokensDTO>> {
    return this.http.post<ApiResponse<JWTTokensDTO>>(
      `${this.apiUrl}/refresh-token`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  setTokens(tokens: JWTTokensDTO): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
