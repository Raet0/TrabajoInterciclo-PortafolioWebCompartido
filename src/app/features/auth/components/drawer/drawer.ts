import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeSwitcher],
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  scrollToHome() {
    const element = document.getElementById('home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeDrawer();
    }
  }

  scrollToProjects() {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeDrawer();
    }
  }

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeDrawer();
    }
  }

  scrollToPerfiles() {
    const element = document.getElementById('perfiles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeDrawer();
    }
  }

  private closeDrawer() {
    const drawerToggle = document.getElementById('my-drawer-2') as HTMLInputElement;
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  }
}