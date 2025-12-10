import { Routes } from '@angular/router';
import { Landing } from './features/landing/pages/landing/landing';
import { Perfiles } from './features/landing/components/perfiles/perfiles';
import { RafaelProfile } from './features/rafael-profile/pages/rafael-profile/rafael-profile';
import { AdrianProfile } from './features/adrian-profile/pages/adrian-profile/adrian-profile';

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
    path:'rafael-profile',
    component: RafaelProfile
  },
  {
    path:'adrian-profile',
    component: AdrianProfile
  },
];
