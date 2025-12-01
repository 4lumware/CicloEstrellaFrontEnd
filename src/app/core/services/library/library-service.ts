import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../constants/api';
import { ApiResponse } from '../../models/responses/response';
import {
  FavoriteCreateRequest,
  LibraryResponse,
  TeacherDetails,
  FormalityDetails
} from '../../models/library/library';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/students';

  /**
   * Obtener todos los favoritos de un estudiante
   */
  getLibrary(studentId: number): Observable<LibraryResponse[]> {
    return this.http
      .get<ApiResponse<LibraryResponse[]>>(`${this.apiUrl}/${studentId}/favorites`)
      .pipe(map((response) => response.data || []));
  }

  /**
   * Obtener un favorito específico
   */
  getFavoriteById(studentId: number, favoriteId: number): Observable<LibraryResponse> {
    return this.http
      .get<ApiResponse<LibraryResponse>>(`${this.apiUrl}/${studentId}/favorites/${favoriteId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Agregar a favoritos (profesor o trámite)
   */
  addToLibrary(studentId: number, favorite: FavoriteCreateRequest): Observable<LibraryResponse> {
    return this.http
      .post<ApiResponse<LibraryResponse>>(`${this.apiUrl}/${studentId}/favorites`, favorite)
      .pipe(map((response) => response.data));
  }

  /**
   * Eliminar de favoritos
   */
  removeFromLibrary(studentId: number, favoriteId: number): Observable<LibraryResponse> {
    return this.http
      .delete<ApiResponse<LibraryResponse>>(`${this.apiUrl}/${studentId}/favorites/${favoriteId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Verificar si un item está en favoritos
   * ⭐ SOLUCIÓN: Usar type guards para acceder a las propiedades correctas
   */
  isFavorite(
    studentId: number,
    type: 'TEACHER' | 'FORMALITY',
    referenceId: number
  ): Observable<boolean> {
    return this.getLibrary(studentId).pipe(
      map((favorites) =>
        favorites.some((fav) => {
          if (fav.type !== type) return false;

          // ⭐ Type guard para distinguir entre TeacherDetails y FormalityDetails
          if (type === 'TEACHER') {
            const teacher = fav.favorite as TeacherDetails;
            return teacher.id === referenceId;
          } else {
            const formality = fav.favorite as FormalityDetails;
            return formality.idFormality === referenceId;
          }
        })
      )
    );
  }

  /**
   * Obtener el ID del favorito para poder eliminarlo
   */
  getFavoriteId(
    studentId: number,
    type: 'TEACHER' | 'FORMALITY',
    referenceId: number
  ): Observable<number | null> {
    return this.getLibrary(studentId).pipe(
      map((favorites) => {
        const favorite = favorites.find((fav) => {
          if (fav.type !== type) return false;

          if (type === 'TEACHER') {
            const teacher = fav.favorite as TeacherDetails;
            return teacher.id === referenceId;
          } else {
            const formality = fav.favorite as FormalityDetails;
            return formality.idFormality === referenceId;
          }
        });

        return favorite ? favorite.id : null;
      })
    );
  }
}
