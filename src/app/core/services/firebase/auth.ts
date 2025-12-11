import { inject, Injectable, signal } from '@angular/core';
import { Auth as FirebaseAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private firebaseAuth: FirebaseAuth = inject(FirebaseAuth);

  // Signal para el usuario actual
  currentUser = signal<User | null>(null);

  // Observable del estado de autenticación
  user$ = user(this.firebaseAuth);

  constructor() {
    // Suscribirse a cambios en el estado de autenticación
    this.user$.subscribe((user: User | null) => {
      this.currentUser.set(user);
    });
  }

  /**
   * Registrar nuevo usuario con email y password
   */
  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  /**
   * Login con email y password
   */
  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  /**
   * Verificar si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
