import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Drawer } from '../../components/drawer/drawer';
import { Footer } from '../../components/footer/footer';
import { Auth } from '../../../../core/services/firebase/auth';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Drawer, Footer],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder) as FormBuilder;
  private auth = inject(Auth) as Auth;
  private userService = inject(UserService) as UserService;
  private router = inject(Router) as Router;

  loading = signal(false);

  // 🔥 Se llama igual que en tu HTML
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading.set(true);

    try {
      const result = await this.auth.login(email, password).toPromise();

      if (!result || !result.user) {
        alert('Error inesperado iniciando sesión.');
        this.loading.set(false);
        return;
      }

      const firebaseUser = result.user;

      const profile = await this.userService.getUserProfile(firebaseUser.uid);

      if (!profile) {
        alert('Tu usuario no tiene perfil en Firestore.');
        this.loading.set(false);
        return;
      }

      this.userService.userProfile.set(profile);

      switch (profile.rol) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'programador':
          this.router.navigate(['/programmer']);
          break;
        case 'usuario':
          this.router.navigate(['/usuario']);
          break;
        default:
          this.router.navigate(['/']);
      }

    } catch (error) {
      console.error(error);
      alert('Credenciales incorrectas');
    } finally {
      this.loading.set(false);
    }
  }
}
