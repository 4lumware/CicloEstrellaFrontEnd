import { inject, Injectable } from '@angular/core';
import { ApplicationUserService } from '../../users/rest/application-user-service';
import { StaffModel, StaffModelCreate } from '../../../models/staffs/staff';
import { StaffAdapterRest } from '../../../adapters/staffs/StaffAdapterRest';
import { StaffService } from '../rest/staff-service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/responses/response';

@Injectable({
  providedIn: 'root',
})
export class StaffUpdateService {
  private staffService = inject(StaffService);
  update(userId: number, data: StaffModelCreate): Observable<ApiResponse<StaffModel>> {
    const staffAdapter = StaffAdapterRest(data);
    return this.staffService.update(userId, staffAdapter);
  }
}
