import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../consts/api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = API_URL + '/roles';

  private http = inject(HttpClient);

  index(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
