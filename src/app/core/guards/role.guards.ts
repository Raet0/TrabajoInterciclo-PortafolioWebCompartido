import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
// 1. CORRECCIÓN: Usar el nombre correcto del servicio para evitar conflictos
import { AuthService } from '../services/firebase/auth'; 

export const roleGuard = (allowedRoles: ('admin'|'programador'|'usuario')[]): CanActivateFn => {
  return async () => {
    const router = inject(Router);
    const userService = inject(UserService);
    const auth = inject(AuthService);

    // 2. CORRECCIÓN CRÍTICA: Esperar a que Firebase cargue
    // Sin esto, al dar F5, 'currentUser' será null por unos milisegundos y te expulsará.
    await auth.waitForAuth();

    // Si no hay usuario autenticado -> login
    const firebaseUser = auth.currentUser();
    if (!firebaseUser) {
      router.navigate(['/login']);
      return false;
    }

    // Si la señal ya tiene profile, úsalo
    let profile = userService.userProfile();
    
    // Si no está en memoria, búscalo en la base de datos
    if (!profile) {
      try {
        const p = await userService.getUserProfile(firebaseUser.uid);
        if (p) {
          // 3. CORRECCIÓN LÓGICA: Actualizar la memoria (Signal), NO la base de datos
          // Antes tenías 'await userService.setUserProfile(...)', eso guarda en Firestore.
          // Aquí solo queremos cargar los datos en la app:
          userService.userProfile.set(p); 
          profile = p;
        }
      } catch (error) {
        console.error('Error recuperando perfil en guard:', error);
      }
    }

    if (!profile) {
      // Perfil no existe (error de datos o usuario incompleto) -> login
      router.navigate(['/login']);
      return false;
    }

    // Verificar Rol
    if (!allowedRoles.includes(profile.rol as any)) {
      // Si está logueado pero no tiene permisos, mandar a una ruta segura (ej. home de usuario)
      router.navigate(['/usuario']);
      return false;
    }

    return true;
  };
};