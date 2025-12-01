import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LibraryRequest, LibraryResponse } from '../../models/library/library';
import { ApiResponse } from '../../models/responses/response';
import {API_URL} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = API_URL + '/students';
  private http = inject(HttpClient);

  constructor() { }


  getLibrary(studentId: number): Observable<LibraryResponse[]> {
    return this.http.get<ApiResponse<LibraryResponse[]>>(`${this.apiUrl}/${studentId}/favorites`)
      .pipe(
        map(response => response.data) // Extraemos solo el array de datos de la ApiResponse
      );
  }

  addToLibrary(studentId: number, item: LibraryRequest): Observable<LibraryResponse> {
    return this.http.post<ApiResponse<LibraryResponse>>(`${this.apiUrl}/${studentId}/favorites`, item)
      .pipe(
        map(response => response.data)
      );
  }

  removeFromLibrary(studentId: number, favoriteId: number): Observable<LibraryResponse> {
    return this.http.delete<ApiResponse<LibraryResponse>>(`${this.apiUrl}/${studentId}/favorites/${favoriteId}`)
      .pipe(
        map(response => response.data)
      );
  }
}
