import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse, ApiResponse } from '../../models/responses/response';
import { TeacherModel, TeacherModelCreate } from '../../models/teachers/teacher';
import {
  RequestContentModel,
  RequestModelCreate,
  TeacherRequestParamsFilter,
} from '../../models/requests/requests';
import { ReviewModel } from '../../models/reviews/review';
import {
  NullableSelectOptionValue,
  UserTeacherRequestFilterValue,
} from '../../../pages/private/user/teacher-requests/components/teacher-requests-search-form/teacher-requests-search-form';

export interface UserTeacherRequestParamsFilter {
  fullName?: string | null;
  careerIds?: NullableSelectOptionValue<number>;
  courseIds?: NullableSelectOptionValue<number>;
  campusIds?: NullableSelectOptionValue<number>;
  page?: number;
  size?: number;
}
@Injectable({
  providedIn: 'root',
})
export class TeacherRequestService {
  private apiUrl = API_URL + '/requests';
  private studentCreate = (studentId: string) => `${API_URL}/students/${studentId}/requests`;

  private destroyApiUrl = (studentId: number, requestId: number) =>
    `${API_URL}/students/${studentId}/requests/${requestId}`;

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

  public create(
    studentId: string,
    payload: RequestModelCreate<TeacherModelCreate>
  ): Observable<ApiResponse<RequestContentModel<TeacherModel>>> {
    return this.http.post<ApiResponse<RequestContentModel<TeacherModel>>>(
      this.studentCreate(studentId),
      payload
    );
  }

  public getByStudentId(
    params: UserTeacherRequestParamsFilter,
    studentId: number
  ): Observable<PageResponse<RequestContentModel<TeacherModel>[]>> {
    let requestParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        requestParams = requestParams.set(key, value.toString());
      }
    });
    return this.http.get<PageResponse<RequestContentModel<TeacherModel>[]>>(
      `${API_URL}/students/${studentId}/requests`,
      { params: requestParams }
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
