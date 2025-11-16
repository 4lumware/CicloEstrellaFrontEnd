import { HttpInterceptorFn } from '@angular/common/http';

export const authJwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/login')) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  console.log('AuthInterceptor - Token:', token);
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
