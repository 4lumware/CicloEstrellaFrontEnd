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

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = API_URL + '/teachers';
  private http = inject(HttpClient);

  public index(params: TeacherParamsFilter): Observable<TeacherModel[]> {
    let teacherParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        teacherParams = teacherParams.set(key, value.toString());
      }
    });

    return this.http.get<TeacherModel[]>(this.apiUrl, {
      params: teacherParams,
    });
  }

  public destroy(teacherId: number): Observable<TeacherModel> {
    return this.http.delete<TeacherModel>(`${this.apiUrl}/${teacherId}`);
  }

  public store(teacher: TeacherModelCreate): Observable<TeacherModelCreate> {
    return this.http.post<TeacherModelCreate>(this.apiUrl, teacher);
  }

  public update(teacherId: number, teacher: TeacherModelUpdate): Observable<TeacherModelUpdate> {
    return this.http.put<TeacherModelUpdate>(`${this.apiUrl}/${teacherId}`, teacher);
  }
}
