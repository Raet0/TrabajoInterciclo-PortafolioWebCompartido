import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Drawer } from '../../components/drawer/drawer';
import { Footer } from '../../components/footer/footer';
import { AuthService } from '../../../../core/services/firebase/auth';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Drawer, Footer, CommonModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string>('');
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  // LOGIN NORMAL
  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const result = await this.authService.login(email, password).toPromise();

      if (!result?.user) {
        this.errorMessage.set('Error inesperado iniciando sesión');
        this.loading.set(false);
        return;
      }

      await this.handleUserRedirection(result.user.uid);

    } catch (error: any) {
      console.error(error);
      this.handleAuthErrors(error);
    } finally {
      this.loading.set(false);
    }
  }

  // LOGIN GOOGLE
  async loginWithGoogle() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const result = await this.authService.loginWithGoogle().toPromise();

      if (!result?.user) {
        this.errorMessage.set('No se pudo iniciar sesión con Google');
        this.loading.set(false);
        return;
      }

      // Verificamos si existe perfil
      let profile = await this.userService.getUserProfile(result.user.uid);

      // Si es nuevo, lo creamos
      if (!profile) {
        console.log('Usuario nuevo de Google, creando perfil...');
        const newProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          nombre: result.user.displayName || 'Usuario Google',
          rol: 'usuario'
        };

        // CORRECCIÓN CLAVE: 'as any' para evitar error de tipado
        await this.userService.setUserProfile(result.user.uid, newProfile as any);

        profile = newProfile as any;
      }

      await this.handleUserRedirection(result.user.uid);

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.errorMessage.set('Inicio de sesión cancelado');
      } else {
        this.errorMessage.set('Error al entrar con Google');
      }
      this.loading.set(false);
    }
  }

  private async handleUserRedirection(uid: string) {
    const profile = await this.userService.getUserProfile(uid);
    if (!profile) {
      this.errorMessage.set('Tu usuario no tiene perfil en Firestore');
      return;
    }
    this.userService.userProfile.set(profile);

    switch (profile.rol) {
      case 'admin': this.router.navigate(['/admin']); break;
      case 'programador': this.router.navigate(['/programador']); break;
      case 'usuario': this.router.navigate(['/usuario']); break;
      default: this.router.navigate(['/']);
    }
  }

  private handleAuthErrors(error: any) {
    const errorCode = error?.code;
    if (errorCode === 'auth/user-not-found') this.errorMessage.set('Usuario no encontrado');
    else if (errorCode === 'auth/wrong-password') this.errorMessage.set('Contraseña incorrecta');
    else if (errorCode === 'auth/invalid-email') this.errorMessage.set('Email inválido');
    else this.errorMessage.set('Error al iniciar sesión');
  }
}
