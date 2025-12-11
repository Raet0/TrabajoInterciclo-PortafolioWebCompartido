// src/app/models.ts
export interface Usuario {
  uid: string;
  nombre: string;
  email?: string;
  rol: 'admin' | 'programador' | 'usuario';
}

export interface ProgramadorProfile {
  id: string; // doc id / uid
  nombre: string;
  especialidad: string;
  descripcion?: string;
  fotoUrl?: string;
  contactos?: { tipo: string; url: string }[]; // e.g. {tipo:'github', url:'...'}
  redes?: { nombre: string; url: string }[];
  disponibilidad?: { dia: string; desde: string; hasta: string }[]; // admin registra horarios
  proyectos?: Proyecto[];
  asesoriasSolicitadas?: Asesoria[]; // opcional
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  participacion: 'Frontend'|'Backend'|'Base de Datos'|'Fullstack';
  tecnologias: string[];
  repoUrl?: string;
  demoUrl?: string;
  seccion: 'Academico'|'Laboral';
}

export interface Asesoria {
  id?: string;
  programadorId: string;
  solicitanteNombre?: string;
  solicitanteEmail?: string;
  fechaISO: string;
  comentario?: string;
  estado: 'pendiente'|'aprobada'|'rechazada';
  respuesta?: string;
}
