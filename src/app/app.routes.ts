import { Routes } from '@angular/router';
import { Landing } from './features/landing/pages/landing/landing';
import { Perfiles } from './features/landing/components/perfiles/perfiles';
import { RafaelProfile } from './features/rafael-profile/pages/rafael-profile/rafael-profile';
import { AdrianProfile } from './features/adrian-profile/pages/adrian-profile/adrian-profile';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';

export const routes: Routes = [
  {
    path: '',
    component: Landing 
  },
  {
    path:'perfiles',
    component: Perfiles
  },
  {
    path:'login',
    component: LoginPage
  },
    {
    path:'register',
    component: RegisterPage
  },
  {
    path:'rafael',
    component: RafaelProfile
  },
  {
    path:'adrian',
    component: AdrianProfile
  },
];
