import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorPerfil as ProgramadorProfile } from '../../core/services/programmer.service';
import { Auth } from '../../core/services/firebase/auth';
import { ProgramadorService } from '../../core/services/programmer.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
})
export class AdminPageComponent {
  auth = inject(Auth);
  programadorService = inject(ProgramadorService);
  userService = inject(UserService);

  programadores = signal<ProgramadorProfile[]>([]);
  form = signal<Partial<ProgramadorProfile & { email?: string; password?: string }>>({});
  editingId = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.programadores.set(this.programadorService.programadores());
    });
  }

  async addOrUpdate() {
    const data = this.form();
    if (!data.nombre || !data.especialidad || (!this.editingId() && (!data.email || !data.password))) {
      return alert('Nombre, especialidad, email y password son requeridos al crear.');
    }

    if (this.editingId()) {
      await this.programadorService.updateProgrammer(this.editingId()!, {
        nombre: data.nombre!,
        especialidad: data.especialidad!,
        descripcion: data.descripcion || ''
      });
      this.cancelEdit();
    } else {
      try {
        // Crear usuario en Firebase Auth y esperar al observable
        const userCredential = await firstValueFrom(this.auth.register(data.email!, data.password!));
        const uid = userCredential.user.uid;

        // Crear documento en Firestore con el mismo UID en programadores
        await this.programadorService.createProgrammer(uid, {
          uid,
          nombre: data.nombre!,
          especialidad: data.especialidad!,
          descripcion: data.descripcion || '',
          fotoUrl: '',
          redes: [],
          habilidades: []
        });

        // Crear documento en users/{uid} para perfil de usuario
        await this.userService.setUserProfile(uid, {
          uid,
          email: data.email!,
          nombre: data.nombre!,
          rol: 'programador'
        });

        this.form.set({});
      } catch (error: any) {
        console.error('Error al crear usuario en Auth:', error);
        alert('Error al crear el programador: ' + error.message);
      }
    }
  }

  edit(p: ProgramadorProfile) {
    this.editingId.set(p.uid);
    this.form.set({ ...p });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.set({});
  }

  async remove(uid: string) {
    if (!confirm('Eliminar programador?')) return;

    // Eliminar de programadores
    await this.programadorService.deleteProgrammer(uid);

    // Eliminar de users
    await deleteDoc(doc(this.userService['firestore'], `users/${uid}`));
  }
}
