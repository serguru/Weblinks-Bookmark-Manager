import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');  
};
