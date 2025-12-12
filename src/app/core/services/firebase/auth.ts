import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, UserCredential, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// CAMBIO CLAVE: Renombramos la clase a 'AuthService'
export class AuthService { 
  
  // Como ya no hay choque de nombres, podemos inyectar 'Auth' directamente
  private firebaseAuth = inject(Auth); 
  
  currentUser = signal<User | null>(null);
  private authInitialized: Promise<void>;

  constructor() {
    this.authInitialized = new Promise((resolve) => {
      onAuthStateChanged(this.firebaseAuth, (user) => {
        this.currentUser.set(user);
        console.log('Usuario autenticado:', user?.email || 'No autenticado');
        resolve();
      });
    });
  }

  async waitForAuth(): Promise<void> {
    return this.authInitialized;
  }

  register(email: string, pass: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, pass));
  }

  login(email: string, pass: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, pass));
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }
  // -- nuevo metodo --
  loginWithGoogle() : Observable<UserCredential>{
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.firebaseAuth, provider));
  }
}