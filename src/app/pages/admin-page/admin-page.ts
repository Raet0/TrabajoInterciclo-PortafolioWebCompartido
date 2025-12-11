import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorProfile } from '../../models';
import { Auth } from '../../core/services/firebase/auth';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
})
export class AdminPageComponent {
  auth = inject(Auth);

  programadores = signal<ProgramadorProfile[]>([]);
  form = signal<Partial<ProgramadorProfile>>({});
  editingId = signal<string | null>(null);

  constructor() {}

  addOrUpdate() {
    const data = this.form();
    if (!data.nombre || !data.especialidad) return alert('Nombre y especialidad requeridos');

    if (this.editingId()) {
      this.programadores.update(list =>
        list.map(p => p.id === this.editingId() ? ({ ...(p), ...(data as any) }) : p)
      );
      this.cancelEdit();
    } else {
      const nuevo: ProgramadorProfile = {
        id: Math.random().toString(36).slice(2),
        nombre: data.nombre!,
        especialidad: data.especialidad!,
        descripcion: data.descripcion || '',
        fotoUrl: data.fotoUrl || '',
        contactos: data.contactos || [],
        redes: data.redes || [],
        disponibilidad: [],
        proyectos: [],
      };
      this.programadores.update(list => [nuevo, ...list]);
      this.form.set({});
    }
  }

  edit(p: ProgramadorProfile) {
    this.editingId.set(p.id);
    this.form.set({ ...p });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.set({});
  }

  remove(id: string) {
    if (!confirm('Eliminar programador?')) return;
    this.programadores.update(list => list.filter(p => p.id !== id));
  }
}
