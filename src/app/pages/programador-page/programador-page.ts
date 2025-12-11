import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ProgramadorProfile, Proyecto, Asesoria } from '../../models';
import { Auth } from '../../core/services/firebase/auth';

@Component({
  selector: 'app-programador-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programador-page.html',
})
export class ProgramadorPageComponent {
  auth = inject(Auth);

  profile = signal<ProgramadorProfile | null>(null);

  proyectoForm = signal<Partial<Proyecto>>({
    seccion: 'Academico',
    tecnologias: []
  });

  asesorias = signal<Asesoria[]>([]);

  constructor() {}

  addProyecto() {
    const p = this.proyectoForm();
    if (!p.nombre) return;

    const nuevo: Proyecto = {
      id: Math.random().toString(36).slice(2),
      nombre: p.nombre!,
      descripcion: p.descripcion || '',
      participacion: (p.participacion as any) || 'Frontend',
      tecnologias: p.tecnologias || [],
      repoUrl: p.repoUrl,
      demoUrl: p.demoUrl,
      seccion: (p.seccion as any) || 'Academico',
    };

    this.profile.update(pr =>
      pr ? ({ ...pr, proyectos: [nuevo, ...(pr.proyectos || [])] }) : pr
    );

    this.proyectoForm.set({ seccion: 'Academico', tecnologias: [] });
  }

  responderAsesoria(a: Asesoria, aprobo: boolean, mensaje?: string) {
    this.asesorias.update(list =>
      list.map(x => x.id === a.id
        ? ({ ...x, estado: aprobo ? 'aprobada' : 'rechazada', respuesta: mensaje })
        : x
      )
    );
  }
}
