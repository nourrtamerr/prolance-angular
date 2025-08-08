import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const roles = authService.getRoles();
  console.log("myroles",roles);
  if (roles?.some(role=>role === 'Admin')) {
    
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
