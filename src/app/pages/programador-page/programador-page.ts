import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorProfile, Proyecto, Asesoria } from '../../models';
import { Auth } from '../../core/services/firebase/auth';
import { AsesoriaService } from '../../core/services/asesoria.service';
import { FilterHistoryPipe } from '../../core/pipes/filter-pending.history';
import { FilterPendingPipe } from '../../core/pipes/filter-pending.pipe';
import { ProgramadorService } from '../../core/services/programmer.service';

@Component({
  selector: 'app-programador-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPendingPipe, FilterHistoryPipe],
  templateUrl: './programador-page.html',
})
export class ProgramadorPageComponent {
  auth = inject(Auth);
  private asesoriasService = inject(AsesoriaService);
  private programadorService = inject(ProgramadorService);

  profile = signal<ProgramadorProfile & { uid: string } | null>(null);
  proyectoForm = signal<Partial<Proyecto>>({ seccion: 'Academico', tecnologias: [] });

  asesorias = signal<Asesoria[]>([]);
  loadingAsesorias = signal(false);

constructor() {
  // Suscribirse al usuario autenticado
  effect(() => {
    this.auth.user$.subscribe(user => {
      if (!user) return;

      // Cargar perfil del programador desde Firestore
      this.programadorService.getProgrammer(user.uid).then(pr => {
        if (pr) {
          this.profile.set({ ...pr, uid: user.uid, id: '' });
        }
      });

      // Suscribirse a asesorías
      this.asesoriasService.getAsesoriasByProgramador(user.uid).subscribe(list => {
        this.asesorias.set(list);
      });
    });
  });
}

addProyecto() {
  const p = this.proyectoForm();
  if (!p.nombre) return;

  const nuevo: Proyecto = {
    id: Math.random().toString(36).slice(2),
    nombre: p.nombre || '',
    descripcion: p.descripcion || '',
    participacion: p.participacion || 'Frontend',
    tecnologias: p.tecnologias || [],
    repoUrl: p.repoUrl || '',
    demoUrl: p.demoUrl || '',
    seccion: p.seccion || 'Academico',
  };

  this.profile.update(pr => {
    if (!pr) return pr;
    const proyectosActualizados = [nuevo, ...(pr.proyectos || [])];

    // Persistir en Firestore con todos los campos definidos
    this.programadorService.setProyectos(pr.uid, proyectosActualizados);

    return { ...pr, proyectos: proyectosActualizados };
  });

  this.proyectoForm.set({ seccion: 'Academico', tecnologias: [] });
}

  async responderAsesoria(a: Asesoria, aprobo: boolean, mensaje?: string) {
    try {
      await this.asesoriasService.responderAsesoria(a.id!, aprobo, mensaje);
      this.asesorias.update(list =>
        list.map(x => x.id === a.id
          ? ({ ...x, estado: aprobo ? 'aprobada' : 'rechazada', respuesta: mensaje })
          : x
        )
      );
      alert('Respuesta registrada');
    } catch (e) {
      console.error(e);
      alert('Error al actualizar la solicitud');
    }
  }
}
