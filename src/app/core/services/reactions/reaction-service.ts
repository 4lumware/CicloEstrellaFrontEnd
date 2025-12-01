import {inject, Injectable} from '@angular/core';
import { API_URL } from "../../constants/api";
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ApiResponse} from '../../models/responses/response';
import {ReactionModel} from '../../models/reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = API_URL + '/reactions';
  private http = inject(HttpClient);

  getAllReactions(name?: string): Observable<ReactionModel[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<ApiResponse<ReactionModel[]>>(this.apiUrl, { params }).pipe(
      map((response) => response.data || [])
    );
  }

  getById(reactionId: number): Observable<ReactionModel> {
    return this.http.get<ApiResponse<ReactionModel>>(`${this.apiUrl}/${reactionId}`).pipe(
      map((response) => response.data)
    );
  }

  addReactionToReview(reviewId: number, reactionId: number): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(
        `${API_URL}/reviews/${reviewId}/reactions/${reactionId}`,
        {}
      )
      .pipe(map((response) => response.data));
  }

  removeReactionFromReview(
    reviewId: number,
    reviewReactionId: number
  ): Observable<any> {
    return this.http
      .delete<ApiResponse<any>>(
        `${API_URL}/reviews/${reviewId}/reactions/${reviewReactionId}`
      )
      .pipe(map((response) => response.data));
  }

}
