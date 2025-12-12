import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectByRoleGuard } from './core/guards/redirect-by-role.guard'; // 1. Importar el guard
import { roleGuard } from './core/guards/role.guards'; // Corregido: suele ser roleGuard (singular) o roleGuards (plural), verifica tu archivo.
import { Horarios } from './features/landing/components/horarios/horarios';
import { UserProfile } from './features/auth/pages/user-profile/user-profile';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/pages/landing/landing').then(m => m.Landing),
      // Opcional: También puedes poner redirectByRoleGuard aquí si quieres que el landing mande al dashboard si ya hay sesión.
  },
  {
    path:'horarios',
    component: Horarios,
    // import('./features/landing/components/horarios/horarios').then(m => m.Horarios),
  },
  {
    path:'perfiles',
    loadComponent: () =>
      import('./features/landing/components/perfiles/perfiles').then(m => m.Perfiles),
  },
  
  // --- RUTAS PÚBLICAS (Login/Register) ---
  {
    path:'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
    // 2. AGREGADO: Si ya está logueado, este guard lo manda a su dashboard y bloquea el login
    canActivate: [redirectByRoleGuard] 
  },
  {
    path:'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    // 3. AGREGADO: Lo mismo para el registro
    canActivate: [redirectByRoleGuard]
  },
  
  // --- PERFILES PÚBLICOS ---
  {
    path:'rafael',
    loadComponent: () =>
      import('./features/rafael-profile/pages/rafael-profile/rafael-profile').then(m => m.RafaelProfile),
  },
  {
    path:'adrian',
    loadComponent: () =>
      import('./features/adrian-profile/pages/adrian-profile/adrian-profile').then(m => m.AdrianProfile),
  },

  // --- RUTAS PROTEGIDAS (Admin, Programador, Usuario) ---
  {
    path: 'admin',
    canActivate: [
      authGuard, // Primero verifica si hay sesión
      roleGuard(['admin']) // Luego verifica si es admin
    ],
    loadChildren: () =>
      import('./pages/admin-page/admin-page').then(m => [
        { path: '', component: m.AdminPageComponent }
      ]),
  },

  {
    path: 'programador',
    canActivate: [
      authGuard,
      roleGuard(['programador'])
    ],
    loadChildren: () =>
      import('./pages/programador-page/programador-page').then(m => [
        { path: '', component: m.ProgramadorPageComponent }
      ]),
  },

  {
    path: 'usuario',
    canActivate: [
      authGuard,
      roleGuard(['usuario'])
    ],
    loadChildren: () =>
      import('./pages/user-page/user-page').then(m => [
        { path: '', component: m.UsuarioPageComponent }
      ]),
  },

  {
    path: 'user',
    redirectTo: 'usuario',
    pathMatch: 'full'
  },
  {
    path:'perfil',
    component: UserProfile,
  },
  
  // 4. RECOMENDACIÓN: Ruta comodín para 404
  {
    path: '**',
    redirectTo: 'login' // O a una página de 404
  }
];