import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {

  const token = inject(LoginService).token;

  if (token) {
    req = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
  };
  return next(req);
};
