import { inject, Injectable } from '@angular/core';
import { ApplicationUserService } from '../../users/rest/application-user-service';
import { createStaff } from '../../../models/users/user';
import { Observable } from 'rxjs';
import { StaffAdapterRest, StaffModelRest } from '../../../adapters/staffs/StaffAdapterRest';
import { StaffModelCreate } from '../../../models/staffs/staff';
import { JsonResponseDTO } from '../../users/auth/auth-user-service';
import { ApiResponse } from '../../careers/career-service';

@Injectable({
  providedIn: 'root',
})
export class StaffUpdateService {
  private staffService = inject(ApplicationUserService);
  update(userId: number, data: StaffModelCreate): Observable<ApiResponse<StaffModelRest>> {
    const staffAdapter = StaffAdapterRest(data);
    return this.staffService.update(userId, staffAdapter);
  }
}
