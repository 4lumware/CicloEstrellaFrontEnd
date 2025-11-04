import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Option } from '../../components/forms/select/select';
import { API_URL } from '../../consts/api';

export interface Career {
  id: number;
  careerName: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/careers';

  index(): Observable<Option[]> {
    return this.http.get<ApiResponse<Career[]>>(this.apiUrl).pipe(
      map((response) =>
        response.data.map((item) => ({
          value: item.id,
          label: item.careerName,
        }))
      )
    );
  }
}
