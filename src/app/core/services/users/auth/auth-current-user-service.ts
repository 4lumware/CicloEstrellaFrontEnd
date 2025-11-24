import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { StaffModel } from '../../../models/staffs/staff';
import { StudentModel } from '../../../models/students/student';
import { ApiResponse } from '../../../models/responses/response';

@Injectable({ providedIn: 'root' })
export class AuthCurrentUserService {
  private _currentUser = new BehaviorSubject<StaffModel | StudentModel | null>(null);
  public readonly currentUser$ = this._currentUser.asObservable();

  private initialized = false;

  private http = inject(HttpClient);
  private apiUrl = API_URL + '/auth';

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    const access = localStorage.getItem('access_token');
    if (!access) return;

    const role = localStorage.getItem('user_role');
    if (!role) return;

    const endpoint = role === 'STAFF' ? `${this.apiUrl}/staffs/me` : `${this.apiUrl}/students/me`;

    this.http.get<ApiResponse<any>>(endpoint).subscribe({
      next: (response) => {
        this._currentUser.next(response.data);
      },
      error: (err) => {
        console.error('Error fetching current user', err);
        this.logout();
      },
    });
  }

  setCurrentUser(user: any | null) {
    this._currentUser.next(user);
  }

  logout() {
    this._currentUser.next(null);
    localStorage.removeItem('user_role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  get currentUserValue() {
    return this._currentUser.value;
  }
}
