import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorPerfil as ProgramadorProfile } from '../../core/services/programmer.service';
import { Auth } from '../../core/services/firebase/auth';
import { ProgramadorService } from '../../core/services/programmer.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
})
export class AdminPageComponent {
  auth = inject(Auth);
  programadorService = inject(ProgramadorService);

  programadores = signal<ProgramadorProfile[]>([]);
  form = signal<Partial<ProgramadorProfile>>({});
  editingId = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.programadores.set(this.programadorService.programadores());
    });
  }

  async addOrUpdate() {
    const data = this.form();
    if (!data.nombre || !data.especialidad) return alert('Nombre y especialidad requeridos');

    if (this.editingId()) {
      await this.programadorService.updateProgrammer(this.editingId()!, {
        nombre: data.nombre!,
        especialidad: data.especialidad!,
        descripcion: data.descripcion || ''
      });
      this.cancelEdit();
    } else {
      const uid = crypto.randomUUID();
      await this.programadorService.createProgrammer(uid, {
        uid,
        nombre: data.nombre!,
        especialidad: data.especialidad!,
        descripcion: data.descripcion || '',
        fotoUrl: '',
        redes: [],
        habilidades: []
      });
      this.form.set({});
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
    await this.programadorService.deleteProgrammer(uid);
  }
}
