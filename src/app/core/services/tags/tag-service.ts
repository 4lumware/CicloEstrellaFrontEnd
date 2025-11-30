import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import {map, Observable} from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiResponse} from '../../models/responses/response';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = API_URL + '/tags';
  private http = inject(HttpClient);

  // index(): Observable<TagModel[]> {
  //   return this.http.get<TagModel[]>(this.apiUrl);
  // }

  index(keyword?: string): Observable<TagModel[]> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<ApiResponse<TagModel[]>>(this.apiUrl, { params }).pipe(
      map((response) => response.data || [])
    );
  }

  getAllTags(keyword?: string): Observable<TagModel[]> {
    return this.index(keyword);
  }

  getById(tagId: number): Observable<TagModel> {
    return this.http.get<ApiResponse<TagModel>>(`${this.apiUrl}/${tagId}`).pipe(
      map((response) => response.data)
    );
  }
}
