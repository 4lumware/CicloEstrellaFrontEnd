import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../constants/api';
import { ApiResponse } from '../../models/responses/response';
import { CareerModelRest } from '../../models/careers/careers';
import { Option } from '../../../shared/components/forms/select/select';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/careers';

  index(): Observable<Option[]> {
    return this.http.get<ApiResponse<CareerModelRest[]>>(this.apiUrl).pipe(
      map((response) =>
        response.data.map((item) => ({
          value: item.id,
          label: item.careerName,
        }))
      )
    );
  }
}
