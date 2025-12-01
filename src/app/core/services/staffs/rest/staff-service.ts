import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../constants/api';
import { HttpClient } from '@angular/common/http';
import { StaffModel, StaffModelCreateRest, StaffModelUpdate } from '../../../models/staffs/staff';
import { ApiResponse } from '../../../models/responses/response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private storeStaffUrl = API_URL + '/auth/staffs/register';
  private updateStaffUrl = API_URL + '/users';
  private http = inject(HttpClient);

  store(staff: StaffModelCreateRest): Observable<ApiResponse<StaffModel>> {
    return this.http.post<ApiResponse<StaffModel>>(`${this.storeStaffUrl}`, staff);
  }

  update(staffId: number, staff: StaffModelUpdate): Observable<ApiResponse<StaffModel>> {
    return this.http.put<ApiResponse<StaffModel>>(`${this.updateStaffUrl}/${staffId}`, staff);
  }

  delete(userId: number): Observable<ApiResponse<StaffModel>> {
    return this.http.delete<ApiResponse<StaffModel>>(`${this.updateStaffUrl}/${userId}`);
  }
}
