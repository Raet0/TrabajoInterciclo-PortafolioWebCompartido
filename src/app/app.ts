import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/firebase/auth';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  protected readonly title = signal('TrabajoInterciclo-PortafolioWebCompartido');
  isInitialized = signal(false);

  async ngOnInit() {
    // Esperar a que Firebase verifique la sesión
    await this.auth.waitForAuth();

    // Luego cargar la sesión
    this.initializeSession();
  }
  private async initializeSession() {
    const currentUser = this.auth.currentUser();

    console.log('Iniciando sesión, usuario:', currentUser?.email || 'Ninguno');

    if (currentUser && !this.userService.userProfile()) {
      console.log('Cargando perfil de usuario:', currentUser.uid);

      try {
        const profile = await this.userService.getUserProfile(currentUser.uid);
        if (profile) {
          console.log('Perfil cargado:', profile);
          this.userService.userProfile.set(profile);
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
      } finally {
        this.isInitialized.set(true);
      }
    } else {
      this.isInitialized.set(true);
    }
  }
}
