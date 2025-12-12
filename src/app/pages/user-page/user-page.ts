// src/app/features/usuario/pages/user-page/user-page.ts
import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorProfile, Asesoria } from '../../models';
import { Auth } from '../../core/services/firebase/auth';
import { AsesoriaService } from '../../core/services/asesoria.service';
import { Subscription } from 'rxjs';
import { ProgramadorService } from '../../core/services/programmer.service';

@Component({
  selector: 'app-usuario-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-page.html',
})
export class UsuarioPageComponent implements OnInit, OnDestroy {
  auth = inject(Auth);
  private asesoriasService = inject(AsesoriaService);
  private programmerService = inject(ProgramadorService);

  programadores = signal<ProgramadorProfile[]>([]);
  agendarForm = signal<Partial<Asesoria>>({});

  loading = signal(false);

  private asesoriasSub?: Subscription;
  private asesoriasEstadoPrevio: Map<string, string> = new Map();
  private userSub?: Subscription;
  private programadoresSub?: Subscription;

  seleccionar(id: string) {
    this.agendarForm.update(f => ({ ...f, programadorId: id }));
  }

  async enviar() {
    const f = this.agendarForm();
    if (!f.programadorId || !f.fechaISO) return alert('Llena todos los campos');

    const nueva: Asesoria = {
      id: '', // Firestore asigna
      programadorId: f.programadorId!,
      solicitanteNombre: f.solicitanteNombre || 'Anon',
      solicitanteEmail: f.solicitanteEmail,
      fechaISO: f.fechaISO!,
      comentario: f.comentario,
      estado: 'pendiente',
    };

    try {
      this.loading.set(true);
      const id = await this.asesoriasService.crearAsesoria(nueva);
      alert('Solicitud enviada correctamente');
      this.agendarForm.set({});
    } catch (e) {
      console.error(e);
      alert('Error al enviar la solicitud');
    } finally {
      this.loading.set(false);
    }
  }

  ngOnInit() {
    this.programadoresSub = this.programmerService.getProgramadores$().subscribe(progs => {
      // Mapear ProgramadorPerfil[] a ProgramadorProfile[]
      // Suponemos que ProgramadorPerfil tiene un campo 'uid' o 'id' y los campos requeridos por ProgramadorProfile
      const mapped = progs.map((p: any) => ({
        id: p.id ?? p.uid, // Usa 'id' si existe, sino 'uid'
        nombre: p.nombre,
        email: p.email,
        // Añade aquí cualquier otro campo necesario de ProgramadorProfile
        ...p
      }));
      this.programadores.set(mapped);
    });

    this.userSub = this.auth.user$.subscribe(user => {
      if (!user) return;
      const userId = user.uid;
      if (!userId) return;

      this.asesoriasSub?.unsubscribe();
      this.asesoriasSub = this.asesoriasService.getAsesoriasByUser(userId).subscribe(asesorias => {
        // Check for changes in estado and alert if approved or rejected
        asesorias.forEach(a => {
          if (!a.id) return;
          const prevEstado = this.asesoriasEstadoPrevio.get(a.id);
          if (prevEstado && prevEstado !== a.estado) {
            if (a.estado === 'aprobada') {
              alert(`Tu solicitud con ID ${a.id} ha sido aprobada.`);
            } else if (a.estado === 'rechazada') {
              alert(`Tu solicitud con ID ${a.id} ha sido rechazada.`);
            }
          }
          this.asesoriasEstadoPrevio.set(a.id, a.estado);
        });
      });
    });
  }

  ngOnDestroy() {
    this.asesoriasSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.programadoresSub?.unsubscribe();
  }
}
