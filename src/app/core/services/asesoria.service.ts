// src/app/core/services/asesoria.service.ts
import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import type { Asesoria } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {
  private firestore = inject(Firestore);

  // Signal opcional para mantener lista reactiva de asesorías
  asesorias = signal<Asesoria[]>([]);

  constructor() {
    this.loadAllAsesorias();
  }

  /** Cargar todas las asesorías y actualizar signal */
loadAllAsesorias() {
  const col = collection(this.firestore, 'asesorias');
  collectionData(col, { idField: 'id' }).subscribe((docs) => {
    // Mapear explícitamente a Asesoria
    const data: Asesoria[] = (docs as any[]).map(d => ({
      id: d.id,
      programadorId: d.programadorId,
      solicitanteNombre: d.solicitanteNombre,
      solicitanteEmail: d.solicitanteEmail,
      fechaISO: d.fechaISO,
      comentario: d.comentario,
      estado: d.estado,
      respuesta: d.respuesta
    }));
    this.asesorias.set(data);
  });
}

  /** Obtener asesorías de un programador (observable) */
  getAsesoriasByProgramador(programadorId: string): Observable<Asesoria[]> {
    const col = collection(this.firestore, 'asesorias');
    const q = query(col, where('programadorId', '==', programadorId), orderBy('fechaISO', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Asesoria[]>;
  }

  /** Obtener asesorías de un usuario por email (observable) */
  getAsesoriasByUser(email: string): Observable<Asesoria[]> {
    const col = collection(this.firestore, 'asesorias');
    const q = query(col, where('solicitanteEmail', '==', email), orderBy('fechaISO', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Asesoria[]>;
  }

  /** Crear nueva solicitud */
  async crearAsesoria(a: Asesoria) {
    const col = collection(this.firestore, 'asesorias');
    const docRef = await addDoc(col, a);
    return docRef.id;
  }

  /** Aprobar o rechazar asesoría */
  async responderAsesoria(id: string, aprobar: boolean, mensaje?: string) {
    const ref = doc(this.firestore, `asesorias/${id}`);
    await updateDoc(ref, {
      estado: aprobar ? 'aprobada' : 'rechazada',
      respuesta: mensaje || ''
    });
  }
}
