import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
// CORRECCIÓN: Importamos AuthService
import { AuthService } from '../services/firebase/auth'; 

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  // CORRECCIÓN: Inyectamos AuthService
  const auth = inject(AuthService); 

  // Esperar a que Auth se inicialice (Vital para F5/Reload)
  await auth.waitForAuth();

  const profile = userService.userProfile();
  const currentUser = auth.currentUser();

  console.log('AuthGuard - Usuario:', currentUser?.email, 'Perfil:', profile?.email);

  if (currentUser && !profile) {
    try {
      console.log('Cargando perfil desde guard...');
      const loadedProfile = await userService.getUserProfile(currentUser.uid);
      if (loadedProfile) {
        userService.userProfile.set(loadedProfile);
        return true;
      }
    } catch (error) {
      console.error('Error cargando perfil en guard:', error);
      router.navigate(['/login']);
      return false;
    }
  }

  if (!profile) {
    console.log('Sin perfil, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  return true;
};