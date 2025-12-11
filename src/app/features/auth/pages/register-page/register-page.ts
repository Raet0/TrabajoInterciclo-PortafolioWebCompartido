import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Drawer } from "../../components/drawer/drawer";
import { Footer } from "../../components/footer/footer";
import { Auth } from '../../../../core/services/firebase/auth';

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
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm: FormGroup;
  private registerTrigger = signal<RegisterRequest | null>(null);

  // Observable para manejar el registro
  registerResource$ = toObservable(this.registerTrigger).pipe(
    switchMap((params) => {
      if (!params) return of(null);
      return this.authService.register(params.email, params.password);
    })
  );

  isLoading = signal(false);
  errorMsg = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator.bind(this),
      }
    );

    // Effect para navegar cuando el registro sea exitoso
    effect(() => {
      this.registerResource$.subscribe({
        next: (result) => {
          if (result) {
            console.log('Registro exitoso, navegando a /dashboard');
            this.isLoading.set(false);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMsg.set(this.getErrorMessage(error));
        },
      });
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.registerTrigger.set({ email, password });
  }

  private getErrorMessage(error: any): string {
    const code = error?.code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil',
    };
    return errorMessages[code] || 'Error al registrar usuario';
  }

  loading = () => this.isLoading();
  errorMessage = () => this.errorMsg();

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}