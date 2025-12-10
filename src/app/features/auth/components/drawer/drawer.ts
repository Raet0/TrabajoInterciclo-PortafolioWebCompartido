import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
@Component({
  selector: 'app-drawer',
  imports: [ThemeSwitcher, RouterLink, RouterLinkActive],
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
      scrollToPerfiles(){
    const perfilesSection = document.getElementById('perfiles');
    if (perfilesSection){
      perfilesSection.scrollIntoView({behavior: 'smooth'});
    }
  }
  scrollToHome(){
    const homeSelection = document.getElementById('home');
    if (homeSelection){
      homeSelection.scrollIntoView({behavior : 'smooth'});
    }
  }
 }
