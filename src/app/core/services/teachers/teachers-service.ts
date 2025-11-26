import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  TeacherModel,
  TeacherModelCreate,
  TeacherModelUpdate,
  TeacherParamsFilter,
} from '../../models/teachers/teacher';
import { ApiResponse, PageResponse } from '../../models/responses/response';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = API_URL + '/teachers';
  private http = inject(HttpClient);

  public index(params: TeacherParamsFilter): Observable<PageResponse<TeacherModel[]>> {
    let teacherParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        teacherParams = teacherParams.set(key, value.toString());
      }
    });

    return this.http.get<PageResponse<TeacherModel[]>>(this.apiUrl, {
      params: teacherParams,
    });
  }

  public destroy(teacherId: number): Observable<ApiResponse<TeacherModel>> {
    return this.http.delete<ApiResponse<TeacherModel>>(`${this.apiUrl}/${teacherId}`);
  }

  public store(teacher: TeacherModelCreate): Observable<ApiResponse<TeacherModel>> {
    return this.http.post<ApiResponse<TeacherModel>>(this.apiUrl, teacher);
  }

  public update(
    teacherId: number,
    teacher: TeacherModelUpdate
  ): Observable<ApiResponse<TeacherModelUpdate>> {
    return this.http.put<ApiResponse<TeacherModelUpdate>>(`${this.apiUrl}/${teacherId}`, teacher);
  }
}
