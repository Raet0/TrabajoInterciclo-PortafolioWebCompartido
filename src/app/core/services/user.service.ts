// src/app/core/services/user.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, doc, docData, setDoc, getDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Auth as FirebaseAuth, user as afUser } from '@angular/fire/auth';
import type { Usuario } from '../../models';
import { switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private firebaseAuth = inject(FirebaseAuth);

  // Signal que guarda el perfil de usuario desde /users/{uid} o null
  userProfile = signal<Usuario | null>(null);

  constructor() {
    // Escuchar el estado de autenticación de Firebase (evita circular dependency con Auth service)
    const authObs = afUser(this.firebaseAuth);
    // authObs emite User|null
    authObs.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          // limpiar perfil
          this.userProfile.set(null);
          return of(null);
        }
        // cargar profile desde Firestore en /users/{uid}
        const ref = doc(this.firestore, `users/${firebaseUser.uid}`);
        return docData(ref, { idField: 'uid' }) as any;
      })
    ).subscribe((profile: any) => {
      if (!profile) {
        this.userProfile.set(null);
        return;
      }
      const usuario: Usuario = {
        uid: profile.uid,
        nombre: profile.nombre || profile.displayName || '',
        email: profile.email || '',
        rol: profile.rol || 'usuario'
      };
      this.userProfile.set(usuario);
    });
  }

  /**
   * Crea o actualiza el documento /users/{uid}
   */
  async setUserProfile(uid: string, data: Partial<Usuario>) {
    const ref = doc(this.firestore, `users/${uid}`);
    await setDoc(ref, { ...data }, { merge: true });
    // actualizar signal local: opcional, pero útil
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = snap.data() as any;
      this.userProfile.set({
        uid,
        nombre: d.nombre || '',
        email: d.email || '',
        rol: d.rol || 'usuario'
      });
    }
  }

  /**
   * Obtener perfil de un uid (una sola vez)
   */
  async getUserProfile(uid: string): Promise<Usuario | null> {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const d = snap.data() as any;
    return {
      uid,
      nombre: d.nombre || '',
      email: d.email || '',
      rol: d.rol || 'usuario'
    };
  }

  /**
   * Obtener todos los usuarios con un rol (ej: programadores) — devuelve Observable
   */
  getUsersByRole(role: 'admin'|'programador'|'usuario') {
    const col = collection(this.firestore, 'users');
    const q = query(col, where('rol', '==', role));
    return collectionData(q, { idField: 'uid' }) as any;
  }

  currentRole(): Usuario['rol'] | null {
    return this.userProfile()?.rol ?? null;
  }

  currentUid(): string | null {
    return this.userProfile()?.uid ?? null;
  }
}
