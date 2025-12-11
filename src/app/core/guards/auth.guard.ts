import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const router = inject<Router>(Router);
  const userService = inject(UserService);

  const profile = userService.userProfile();

  if (!profile) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
