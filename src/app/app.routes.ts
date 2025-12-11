import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/pages/landing/landing').then(m => m.Landing),
  },
  {
    path:'perfiles',
    loadComponent: () =>
      import('./features/landing/components/perfiles/perfiles').then(m => m.Perfiles),
  },
  {
    path:'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
  },
    {
    path:'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
  },
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
// ADMIN
  {
    path: 'admin',
    canActivate: [
      authGuard,
      roleGuard(['admin'])
    ],
    loadChildren: () =>
      import('./pages/admin-page/admin-page').then(m => [
        { path: '', component: m.AdminPageComponent }
      ]),
  },

  // PROGRAMADOR
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

  // USUARIO NORMAL
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

  // Redirect from /user → /usuario
  {
    path: 'user',
    redirectTo: 'usuario',
    pathMatch: 'full'
  }
];
