import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReviewModel, ReviewParamsFilter } from '../../models/reviews/review';
import { ApiResponse, PageResponse } from '../../models/responses/response';
import { Observable } from 'rxjs';

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
}
