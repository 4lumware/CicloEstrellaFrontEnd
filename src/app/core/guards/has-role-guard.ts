import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/users/auth/auth-user-service';
import { Role, UserRole } from '../models/users/user';
import { catchError, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { StaffModel } from '../models/staffs/staff';
import { StudentModel } from '../models/students/student';
import { RolesService } from '../services/roles/role-service';
import { AuthCurrentUserService } from '../services/users/auth/auth-current-user-service';

export const hasRoleGuard = (roles: UserRole[]): CanActivateFn => {
  return (): Observable<boolean> => {
    const router = inject(Router);
    const rolesService = inject(RolesService);
    const authCurrentUserService = inject(AuthCurrentUserService);

    authCurrentUserService.initialize();

    return authCurrentUserService.currentUser$.pipe(
      filter((user) => user !== null), // ⛔ Espera hasta que llegue un usuario
      take(1), // 🔒 Solo la primera vez
      switchMap((user: StaffModel | StudentModel) => {
        return rolesService.hasRole(user.id, roles).pipe(
          map((response) => {
            if (response.data.hasRole) {
              return true;
            }
            router.navigate(['/login']);
            return false;
          }),
          catchError(() => {
            router.navigate(['/login']);
            return of(false);
          })
        );
      })
    );
  };
};
