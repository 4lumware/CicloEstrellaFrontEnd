import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, finalize } from 'rxjs';
import { AuthUserService, JWTTokensDTO } from '../../services/users/auth/auth-user-service';
import { ApiResponse } from '../../models/responses/response';

// Estado compartido entre todas las invocaciones del interceptor

let isRefreshing = false;
const refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

export const authJwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthUserService);

  if (req.url.endsWith('/login') || req.url.includes('/refresh-token')) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token ? `Bearer ${token}` : ''),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Si ya hay refresh en curso, esperamos el nuevo token
        if (isRefreshing) {
          console.log('⏳ Waiting for token refresh...');
          return refreshTokenSubject$.pipe(
            filter((t) => t != null),
            take(1),
            switchMap((t) => {
              const retryReq = req.clone({
                headers: req.headers
                  .set('Content-Type', 'application/json')
                  .set('Authorization', `Bearer ${t}`),
              });

              return next(retryReq);
            })
          );
        }

        // Iniciar refresh
        const refreshTokenValue = localStorage.getItem('refresh_token');
        if (!refreshTokenValue) return throwError(() => error);

        isRefreshing = true;
        refreshTokenSubject$.next(null);

        return authService.refreshToken(refreshTokenValue).pipe(
          switchMap((response: ApiResponse<JWTTokensDTO>) => {
            const newTokens = response.data;

            console.log('✅ Token refreshed:', newTokens);
            localStorage.setItem('access_token', newTokens.access_token);
            localStorage.setItem('refresh_token', newTokens.refresh_token);

            // Emitimos el nuevo token a todos los requests pendientes
            refreshTokenSubject$.next(newTokens.access_token);

            const retryReq = req.clone({
              headers: req.headers
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${newTokens.access_token}`),
            });
            return next(retryReq);
          }),
          catchError((err) => {
            // Si el refresh falla, limpiamos y propagamos el error
            refreshTokenSubject$.next(null);
            return throwError(() => err);
          }),
          finalize(() => {
            isRefreshing = false;
          })
        );
      }

      return throwError(() => error);
    })
  );
};
