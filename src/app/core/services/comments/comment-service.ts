import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import {
  CommentCreateModel,
  CommentModel,
  CommentParamsFilter,
} from '../../models/comments/comment';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../../models/responses/response';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = API_URL + '/comments';
  private formalityUrl = API_URL + '/formalities';

  public index(params: CommentParamsFilter): Observable<PageResponse<CommentModel[]>> {
    let commentParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        commentParams = commentParams.set(key, value.toString());
      }
    });

    return this.http.get<PageResponse<CommentModel[]>>(this.apiUrl, {
      params: commentParams,
    });
  }

  public destroy(formalityId: number, commentId: number): Observable<ApiResponse<CommentModel>> {
    return this.http.delete<ApiResponse<CommentModel>>(
      `${this.formalityUrl}/${formalityId}/comments/${commentId}`
    );
  }

  public store(
    comment: CommentCreateModel,
    formalityId: number
  ): Observable<ApiResponse<CommentModel>> {
    return this.http.post<ApiResponse<CommentModel>>(
      `${this.formalityUrl}/${formalityId}/comments`,
      comment
    );
  }

  public update(
    comment: CommentCreateModel,
    formalityId: number,
    commentId: number
  ): Observable<ApiResponse<CommentModel>> {
    return this.http.put<ApiResponse<CommentModel>>(
      `${this.formalityUrl}/${formalityId}/comments/${commentId}`,
      comment
    );
  }

  public formalityComments(formalityId: number): Observable<ApiResponse<CommentModel[]>> {
    return this.http.get<ApiResponse<CommentModel[]>>(
      `${this.formalityUrl}/${formalityId}/comments`
    );
  }
}
