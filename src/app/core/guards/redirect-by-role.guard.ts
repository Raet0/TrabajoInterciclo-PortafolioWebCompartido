import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const redirectByRoleGuard: CanActivateFn = () => {
  const router = inject<Router>(Router);
  const userService = inject(UserService);

  const profile = userService.userProfile();

  if (!profile) {
    router.navigate(['/login']);
    return false;
  }

  switch (profile.rol) {
    case 'admin':
      router.navigate(['/admin']);
      break;
    case 'programador':
      router.navigate(['/programador']);
      break;
    default:
      router.navigate(['/usuario']);
      break;
  }

  return false; // ya redirigimos
};
