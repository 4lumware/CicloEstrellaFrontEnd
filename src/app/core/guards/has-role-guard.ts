import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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

    return authCurrentUserService.initialize().pipe(
      switchMap((user: StaffModel | StudentModel | null) => {
        if (!user) {
          console.log('No user logged in');
          router.navigate(['/login']);
          return of(false);
        }

        return rolesService.hasRole(user.id, roles).pipe(
          map((response) => {
            const hasRole = response.data.hasRole;
            if (!hasRole) {
              router.navigate(['/login']);
            }
            return hasRole;
          }),
          catchError(() => {
            router.navigate(['/login']);
            return of(false);
          })
        );
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(false);
      })
    );
  };
};
