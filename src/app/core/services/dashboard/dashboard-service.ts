import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiResponse, PageResponse } from '../../models/responses/response';
import { CharData, DashboardKPIs } from '../../models/dashboard/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = API_URL + '/dashboard';
  private http = inject(HttpClient);

  getKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.apiUrl}/kpis`, {
      params: {
        currentDays: '30',
        previousDays: '30',
      },
    });
  }

  avgRatingPerTeacher(limit: number = 20): Observable<ApiResponse<CharData>> {
    let params = new HttpParams().set('limit', limit);
    return this.http.get<ApiResponse<CharData>>(`${this.apiUrl}/avg-rating-per-teacher`, {
      params,
    });
  }

  studentsByCareer(): Observable<ApiResponse<CharData>> {
    return this.http.get<ApiResponse<CharData>>(`${this.apiUrl}/students-by-career`);
  }

  usersByRole(): Observable<ApiResponse<CharData>> {
    return this.http.get<ApiResponse<CharData>>(`${this.apiUrl}/users-by-role`);
  }

  registrationsByMonth(): Observable<ApiResponse<CharData>> {
    return this.http.get<ApiResponse<CharData>>(`${this.apiUrl}/registrations-by-month`);
  }
}
