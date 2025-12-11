import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Drawer } from '../../components/drawer/drawer';
import { Footer } from '../../components/footer/footer';
import { Auth } from '../../../../core/services/firebase/auth';

interface LoginRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, Drawer, Footer],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm: FormGroup;
  private loginTrigger = signal<LoginRequest | null>(null);

  loginResource$ = toObservable(this.loginTrigger).pipe(
    switchMap((params) => {
      if (!params) return of(null);
      return this.authService.login(params.email, params.password);
    })
  );

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    effect(() => {
      this.loginResource$.subscribe((result) => {
        if (result) {
          console.log('Login exitoso, redirigiendo...');
          this.router.navigate(['/dashboard']);
        }
      });
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.loginTrigger.set({ email, password });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}