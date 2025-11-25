import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../../models/responses/response';
import { TeacherModel } from '../../models/teachers/teacher';
import { RequestContentModel, TeacherRequestParamsFilter } from '../../models/requests/requests';
import { ReviewModel } from '../../models/reviews/review';

@Injectable({
  providedIn: 'root',
})
export class TeacherRequestService {
  private apiUrl = API_URL + '/requests';

  private destroyApiUrl = (studentId: number, requestId: number) =>
    `${this.apiUrl}/${requestId}/student/${studentId}`;

  private http = inject(HttpClient);

  public index(
    params: TeacherRequestParamsFilter
  ): Observable<PageResponse<RequestContentModel<TeacherModel[]>>> {
    let reviewParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        reviewParams = reviewParams.set(key, value.toString());
      }
    });

    return this.http.get<PageResponse<RequestContentModel<TeacherModel[]>>>(this.apiUrl, {
      params: reviewParams,
    });
  }

  public destroy(
    requestId: number,
    studentId: number
  ): Observable<PageResponse<RequestContentModel<TeacherModel>>> {
    return this.http.delete<PageResponse<RequestContentModel<TeacherModel>>>(
      this.destroyApiUrl(studentId, requestId)
    );
  }

  public acceptRequest(
    requestId: number
  ): Observable<PageResponse<RequestContentModel<TeacherModel>>> {
    return this.http.post<PageResponse<RequestContentModel<TeacherModel>>>(
      `${this.apiUrl}/${requestId}/accept-request`,
      {}
    );
  }

  public rejectRequest(
    requestId: number
  ): Observable<PageResponse<RequestContentModel<TeacherModel>>> {
    return this.http.delete<PageResponse<RequestContentModel<TeacherModel>>>(
      `${this.apiUrl}/${requestId}/reject-request`,
      {}
    );
  }
}
