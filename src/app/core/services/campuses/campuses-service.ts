import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/responses/response';
import { CampusModel } from '../../models/campuses/campuses';

@Injectable({
  providedIn: 'root',
})
export class CampusService {
  private apiUrl = API_URL + '/campuses';

  private http = inject(HttpClient);

  index(): Observable<ApiResponse<CampusModel[]>> {
    return this.http.get<ApiResponse<CampusModel[]>>(this.apiUrl);
  }
}
