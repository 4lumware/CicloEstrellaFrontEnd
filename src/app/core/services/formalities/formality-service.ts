import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FormalityModel,
  FormalityModelCreate,
  FormalityModelUpdate,
  FormalityParamsFilter,
} from '../../models/formalities/formality';

@Injectable({
  providedIn: 'root',
})
export class FormalityService {
  private apiUrl = API_URL + '/formalities';
  private http = inject(HttpClient);

  index(params: FormalityParamsFilter): Observable<FormalityModel[]> {
    let formalityParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        formalityParams = formalityParams.set(key, value.toString());
      }
    });
    return this.http.get<FormalityModel[]>(this.apiUrl, { params: formalityParams });
  }

  destroy(formalityId: number): Observable<FormalityModel> {
    return this.http.delete<FormalityModel>(`${this.apiUrl}/${formalityId}`);
  }

  store(formality: FormalityModelCreate): Observable<FormalityModelCreate> {
    return this.http.post<FormalityModelCreate>(this.apiUrl, formality);
  }

  update(formality: FormalityModelUpdate): Observable<FormalityModelUpdate> {
    return this.http.put<FormalityModelUpdate>(
      `${this.apiUrl}/${formality.idFormality}`,
      formality
    );
  }
}
