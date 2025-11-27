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
import { ApiResponse, PageResponse } from '../../models/responses/response';

@Injectable({
  providedIn: 'root',
})
export class FormalityService {
  private apiUrl = API_URL + '/formalities';
  private http = inject(HttpClient);

  index(params: FormalityParamsFilter): Observable<PageResponse<FormalityModel[]>> {
    let formalityParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        formalityParams = formalityParams.set(key, value.toString());
      }
    });
    return this.http.get<PageResponse<FormalityModel[]>>(this.apiUrl, { params: formalityParams });
  }

  destroy(formalityId: number): Observable<ApiResponse<FormalityModel>> {
    return this.http.delete<ApiResponse<FormalityModel>>(`${this.apiUrl}/${formalityId}`);
  }

  store(formality: FormalityModelCreate): Observable<ApiResponse<FormalityModelCreate>> {
    return this.http.post<ApiResponse<FormalityModelCreate>>(this.apiUrl, formality);
  }

  update(formality: FormalityModelUpdate): Observable<ApiResponse<FormalityModelUpdate>> {
    return this.http.put<ApiResponse<FormalityModelUpdate>>(`${this.apiUrl}`, formality);
  }
}
