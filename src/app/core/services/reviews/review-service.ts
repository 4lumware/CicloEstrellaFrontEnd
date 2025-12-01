import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CreateReviewRequest, ReviewModel, ReviewParamsFilter, UpdateReviewRequest} from '../../models/reviews/review';
import { ApiResponse, PageResponse } from '../../models/responses/response';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = API_URL + '/reviews';

  private http = inject(HttpClient);

  public index(params: ReviewParamsFilter): Observable<PageResponse<ReviewModel[]>> {
    let reviewParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        reviewParams = reviewParams.set(key, value.toString());
      }
    });

    return this.http.get<PageResponse<ReviewModel[]>>(this.apiUrl, {
      params: reviewParams,
    });
  }

  public destroy(reviewId: number): Observable<ApiResponse<ReviewModel>> {
    return this.http.delete<ApiResponse<ReviewModel>>(`${this.apiUrl}/${reviewId}`);
  }

  public getReviewsByTeacher(teacherId: number, keyword?: string): Observable<ReviewModel[]> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http
      .get<ApiResponse<ReviewModel[]>>(`${API_URL}/teachers/${teacherId}/reviews`, { params })
      .pipe(map((response) => response.data || []));
  }

  public store(review: CreateReviewRequest): Observable<ApiResponse<ReviewModel>> {
    return this.http.post<ApiResponse<ReviewModel>>(this.apiUrl, review);
  }

  public update(
    reviewId: number,
    review: UpdateReviewRequest
  ): Observable<ApiResponse<ReviewModel>> {
    return this.http.put<ApiResponse<ReviewModel>>(`${this.apiUrl}/${reviewId}`, review);
  }

  public addReaction(reviewId: number, reactionId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${reviewId}/reactions/${reactionId}`,
      {}
    );
  }

  public removeReaction(
    reviewId: number,
    reviewReactionId: number
  ): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${reviewId}/reactions/${reviewReactionId}`
    );
  }
}
