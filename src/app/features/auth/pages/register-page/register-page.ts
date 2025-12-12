import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { Drawer } from "../../components/drawer/drawer";
import { Footer } from "../../components/footer/footer";
import { AuthService } from '../../../../core/services/firebase/auth';
import { UserService } from '../../../../core/services/user.service';

interface RegisterRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, Drawer, Footer, CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  registerForm: FormGroup;
  private registerTrigger = signal<RegisterRequest | null>(null);
  private registerSubscription: Subscription;

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  registerResource$ = toObservable(this.registerTrigger).pipe(
    switchMap((params) => {
      if (!params) return of(null);
      return this.authService.register(params.email, params.password);
    })
  );

  constructor() {
    this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator.bind(this) }
    );

    this.registerSubscription = this.registerResource$.subscribe({
      next: async (result) => {
        if (result?.user) {
          await this.createUserProfile(result.user, true);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMsg.set(this.getErrorMessage(error));
      },
    });
  }

  // --- LÓGICA GOOGLE ---
  async loginWithGoogle() {
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    try {
      const result = await this.authService.loginWithGoogle().toPromise();

      if (!result?.user) {
        this.errorMsg.set('No se pudo autenticar con Google');
        this.isLoading.set(false);
        return;
      }

      const existingProfile = await this.userService.getUserProfile(result.user.uid);
      
      if (!existingProfile) {
        // Usuario nuevo: crear perfil (sin mensaje de carga para que sea fluido)
        await this.createUserProfile(result.user, false);
      } else {
        // Usuario existente: redirigir
        this.userService.userProfile.set(existingProfile);
        this.redirectUser(existingProfile.rol);
      }

    } catch (error: any) {
      this.isLoading.set(false);
      if (error.code === 'auth/popup-closed-by-user') this.errorMsg.set('Registro cancelado');
      else this.errorMsg.set('Error con Google');
    }
  }

  // Helper para crear perfil
  private async createUserProfile(user: any, isEmailRegister: boolean) {
    try {
      if(isEmailRegister) console.log('Creando perfil en Firestore...');
      
      const newProfile = {
        uid: user.uid,
        email: user.email || '',
        nombre: user.displayName || 'Nuevo Usuario',
        rol: 'usuario',
      };

      // CORRECCIÓN CLAVE: 'as any' para pasar la validación
      await this.userService.setUserProfile(user.uid, newProfile as any);

      this.successMsg.set('¡Cuenta creada exitosamente!');
      this.isLoading.set(false);
      this.userService.userProfile.set(newProfile as any);

      setTimeout(() => {
        this.router.navigate(['/usuario']);
      }, 1500);

    } catch (error) {
      console.error('Error post-registro:', error);
      this.isLoading.set(false);
      this.errorMsg.set('Cuenta creada, pero falló el perfil.');
    }
  }

  private redirectUser(rol: string) {
    switch (rol) {
      case 'admin': this.router.navigate(['/admin']); break;
      case 'programador': this.router.navigate(['/programador']); break;
      default: this.router.navigate(['/usuario']); break;
    }
  }

  ngOnDestroy() {
    if (this.registerSubscription) this.registerSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.registerForm.value;
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');
    this.registerTrigger.set({ email, password });
  }

  togglePasswordVisibility() { this.showPassword.set(!this.showPassword()); }
  toggleConfirmPasswordVisibility() { this.showConfirmPassword.set(!this.showConfirmPassword()); }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  private getErrorMessage(error: any): string {
    const code = error?.code || '';
    if (code === 'auth/email-already-in-use') return 'Correo ya registrado';
    if (code === 'auth/invalid-email') return 'Correo inválido';
    if (code === 'auth/weak-password') return 'Contraseña muy débil';
    return 'Error al registrar usuario';
  }

  loading = () => this.isLoading();
  errorMessage = () => this.errorMsg();
  successMessage = () => this.successMsg();
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}