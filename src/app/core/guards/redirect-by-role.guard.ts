import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
// CORRECCIÓN: Importamos AuthService
import { AuthService } from '../services/firebase/auth';

export const redirectByRoleGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  // CORRECCIÓN: Inyectamos AuthService
  const auth = inject(AuthService);

  // CORRECCIÓN VITAL: Esperar a Firebase antes de verificar
  // Sin esto, al recargar (F5) te sacará al login erróneamente.
  await auth.waitForAuth();

  let profile = userService.userProfile();
  const currentUser = auth.currentUser();

  // Si no tiene perfil pero está autenticado, intentar cargarlo
  if (!profile && currentUser) {
    try {
      profile = await userService.getUserProfile(currentUser.uid);
      if (profile) {
        userService.userProfile.set(profile);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      // No redirigimos aquí, dejamos que fluya al check de abajo
    }
  }

  // Si después de intentar cargar, sigue sin perfil, permitir ver el Login
  if (!profile) {
    return true; // Dejamos pasar (mostrar el login)
  }

  // Si YA tiene perfil, redirigir a su dashboard correspondiente
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

  // Bloqueamos el acceso al componente Login porque ya redirigimos
  return false; 
};