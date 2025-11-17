import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/users/auth/auth-user-service';
import { Role, UserRole } from '../models/users/user';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { StaffModel } from '../models/staffs/staff';
import { StudentModel } from '../models/students/student';
import { RolesService } from '../services/roles/role-service';

export const hasRoleGuard = (roles: UserRole[]): CanActivateFn => {
  return (): Observable<boolean> => {
    const router = inject(Router);
    const rolesService = inject(RolesService);
    return inject(AuthUserService).currentUser$.pipe(
      switchMap((user: StaffModel | StudentModel | null) => {
        if (!user) {
          router.navigate(['/login']);
          return of(false);
        }

        const userId = user.id;
        console.log('Verificando roles para el usuario ID:', userId, 'Roles requeridos:', roles);
        return rolesService.hasRole(userId, roles).pipe(
          map((response) => response.data.hasRole),
          catchError(() => of(false))
        );
      })
    );
  };
};
