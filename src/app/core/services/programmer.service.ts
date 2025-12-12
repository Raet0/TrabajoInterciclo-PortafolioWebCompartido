// src/app/core/services/programador.service.ts
import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  collectionData,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ProgramadorPerfil {
  uid: string;
  nombre: string;
  especialidad: string;
  descripcion: string;
  fotoUrl: string;
  cvUrl?: string;
  redes?: { nombre: string; url: string }[];
  habilidades?: string[];
  bioLarga?: string;
  proyectos?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ProgramadorService {
  private firestore = inject(Firestore);

  // Cache (opcional) con señal para reactivo
  programadores = signal<ProgramadorPerfil[]>([]);

  constructor() {
    this.loadAllProgrammers();
  }

  /** 🔥 Cargar todos los programadores (reactivo) */
  loadAllProgramners$() {
    const col = collection(this.firestore, 'programadores');
    return collectionData(col, { idField: 'uid' }) as any;
  }

  /** 🔥 Cargar todos los programadores y guardarlos en signal */
  loadAllProgrammers() {
    const col = collection(this.firestore, 'programadores');
    collectionData(col, { idField: 'uid' }).subscribe((data) => {
      const mapped = (data as any[]).map(d => ({
        uid: d.uid ?? '',
        nombre: d.nombre ?? '',
        especialidad: d.especialidad ?? '',
        descripcion: d.descripcion ?? '',
        fotoUrl: d.fotoUrl ?? '',
        cvUrl: d.cvUrl ?? null,
        redes: d.redes ?? [],
        habilidades: d.habilidades ?? [],
        bioLarga: d.bioLarga ?? '',
        proyectos: d.proyectos ?? []
      }));
      this.programadores.set(mapped);
    });
  }

  /** 🔥 Obtener un programador por UID */
  async getProgrammer(uid: string): Promise<ProgramadorPerfil | null> {
    const ref = doc(this.firestore, `programadores/${uid}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ProgramadorPerfil) : null;
  }

  /** 🔥 Crear un programador (desde Admin) */
  async createProgrammer(uid: string, data: Partial<ProgramadorPerfil>) {
    const ref = doc(this.firestore, `programadores/${uid}`);
    await setDoc(ref, { uid, ...data }, { merge: true });
  }

  /** 🔥 Actualizar datos del programador */
  async updateProgrammer(uid: string, data: Partial<ProgramadorPerfil>) {
    const ref = doc(this.firestore, `programadores/${uid}`);
    await updateDoc(ref, { ...data });
  }

  /** 🔥 Eliminar un programador */
  async deleteProgrammer(uid: string) {
    const ref = doc(this.firestore, `programadores/${uid}`);
    await deleteDoc(ref);
  }

  /** 🔥 Actualizar la propiedad proyectos de un programador */
  async setProyectos(uid: string, proyectos: any[]) {
    const ref = doc(this.firestore, `programadores/${uid}`);
    await updateDoc(ref, { proyectos });
  }

  /** 🔥 Obtener un observable con todos los programadores actualizados en tiempo real */
  getProgramadores$(): Observable<ProgramadorPerfil[]> {
    const col = collection(this.firestore, 'programadores');
    return collectionData(col, { idField: 'uid' }) as Observable<ProgramadorPerfil[]>;
  }
}
