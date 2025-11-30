import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constants/api';
import { StaffModel } from '../../../models/staffs/staff';
import { StudentModel } from '../../../models/students/student';
import { ApiResponse } from '../../../models/responses/response';
import { MapType } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class AuthCurrentUserService {
  private _currentUser = new BehaviorSubject<StaffModel | StudentModel | null>(null);
  public readonly currentUser$ = this._currentUser.asObservable();

  private _initialized = new BehaviorSubject<boolean>(false);
  public readonly initialized$ = this._initialized.asObservable();

  private http = inject(HttpClient);
  private apiUrl = API_URL + '/auth';

  public initialize(): Observable<StaffModel | StudentModel | null> {
    if (this._initialized.value) return of(this._currentUser.value);

    const access = localStorage.getItem('access_token');
    if (!access) return of(null);

    const role = localStorage.getItem('user_role');
    if (!role) return of(null);

    const endpoint = role === 'STAFF' ? `${this.apiUrl}/staffs/me` : `${this.apiUrl}/students/me`;

    return this.http.get<ApiResponse<any>>(endpoint).pipe(
      tap((response) => {
        this._currentUser.next(response.data);
        this._initialized.next(true);
      }),
      map((response) => response.data),
      catchError((err) => {
        console.error('Error fetching current user', err);
        this.logout();
        this._initialized.next(true);
        return of(null);
      })
    );
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

  getCurrentUserId(): number | null {
    const user = this._currentUser.value;
    return user?.id || null;
  }

  getCurrentUser(): StaffModel | StudentModel | null {
    return this._currentUser.value;
  }


  isAuthenticated(): boolean {
    return this._currentUser.value !== null;
  }


  isStaff(): boolean {
    const role = localStorage.getItem('user_role');
    return role === 'STAFF';
  }


  isStudent(): boolean {
    const role = localStorage.getItem('user_role');
    return role === 'STUDENT';
  }


  getUserRole(): 'STAFF' | 'STUDENT' | null {
    const role = localStorage.getItem('user_role');
    return role as 'STAFF' | 'STUDENT' | null;
  }

  getUsername(): string | null {
    const user = this._currentUser.value;
    return (user as any)?.username || null;
  }

  getEmail(): string | null {
    const user = this._currentUser.value;
    return (user as any)?.email || null;
  }

  getProfilePicture(): string | null {
    const user = this._currentUser.value;
    return (user as any)?.profilePictureUrl || null;
  }
}
