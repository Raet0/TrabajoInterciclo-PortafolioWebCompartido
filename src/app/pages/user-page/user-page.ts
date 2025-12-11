import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorProfile, Asesoria } from '../../models';
import { Auth } from '../../core/services/firebase/auth';

@Component({
  selector: 'app-usuario-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-page.html',
})
export class UsuarioPageComponent {
  auth = inject(Auth);

  programadores = signal<ProgramadorProfile[]>([]);
  agendarForm = signal<Partial<Asesoria>>({});

  constructor() {}

  seleccionar(id: string) {
    this.agendarForm.update(f => ({ ...f, programadorId: id }));
  }

  enviar() {
    const f = this.agendarForm();
    if (!f.programadorId || !f.fechaISO) return alert('Llena todos los campos');

    const nueva: Asesoria = {
      id: Math.random().toString(36).slice(2),
      programadorId: f.programadorId!,
      solicitanteNombre: f.solicitanteNombre || 'Anon',
      solicitanteEmail: f.solicitanteEmail,
      fechaISO: f.fechaISO!,
      comentario: f.comentario,
      estado: 'pendiente',
    };

    alert('Solicitud enviada (simulada)');
    this.agendarForm.set({});
  }
}
