import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { Auth } from '../services/firebase/auth';

export const roleGuard = (allowedRoles: ('admin'|'programador'|'usuario')[]): CanActivateFn => {
  return async () => {
    const router = inject<Router>(Router);
    const userService = inject(UserService);
    const auth = inject(Auth);

    // Si no hay usuario autenticado -> login
    const firebaseUser = auth.currentUser();
    if (!firebaseUser) {
      router.navigate(['/login']);
      return false;
    }

    // Si la señal ya tiene profile, úsalo
    let profile = userService.userProfile();
    if (!profile) {
      // intenta obtenerlo una vez desde Firestore
      const p = await userService.getUserProfile(firebaseUser.uid);
      if (p) {
        // setear en la señal para uso global
        await userService.setUserProfile(firebaseUser.uid, p);
        profile = userService.userProfile();
      }
    }

    if (!profile) {
      // perfil no existe -> redirigir a home/login
      router.navigate(['/']);
      return false;
    }

    if (!allowedRoles.includes(profile.rol as any)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};
