import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '../../../landing/components/theme-switcher/theme-switcher';

// Importa tus servicios (Ajusta la cantidad de '../' si es necesario)
import { AuthService } from '../../../../core/services/firebase/auth';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeSwitcher, CommonModule],
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  private authService = inject(AuthService);
  public userService = inject(UserService); // Public para usarlo en el HTML
  
  constructor(public router: Router) {}

  // Función para cerrar sesión
  async logout() {
    try {
      await this.authService.logout().toPromise();
      
      // 1. Limpiamos el perfil en memoria
      this.userService.userProfile.set(null);
      
      // 2. Redirigimos al Login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al salir:', error);
    }
  }

  // Helper para saber a dónde ir al dar clic en "Mi Perfil"
  getDashboardRoute(): string {
    const rol = this.userService.userProfile()?.rol;
    switch (rol) {
      case 'admin': return '/admin';
      case 'programador': return '/programador';
      default: return '/usuario';
    }
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
}