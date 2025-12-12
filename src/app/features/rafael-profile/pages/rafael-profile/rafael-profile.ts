import { Component } from '@angular/core';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
  author: string;
}

@Component({
  selector: 'app-rafael-profile',
  templateUrl: './rafael-profile.html',
})
export class RafaelProfile {
  projects: Project[] = [
    {
      id: 1,
      title: 'Portfolio Web Compartido',
      description: 'Aplicación web multiusuario para gestión de portafolios y proyectos.',
      image: 'assets/images/proyecto1-rafael.png',
      technologies: ['Angular', 'NestJS', 'Firebase'],
      github: 'https://github.com/Raet0/TrabajoInterciclo-PortafolioWebCompartido',
      demo: '#',
      author: 'Rafael'
    },
    {
      id: 2,
      title: 'Sistema de Ordenes',
      description: 'Gestión de productos y órdenes con base de datos relacional.',
      image: 'assets/images/proyecto2-rafael.png',
      technologies: ['Spring Boot', 'MySQL'],
      github: 'https://github.com/Raet0/SistemaOrdenes',
      demo: '#',
      author: 'Rafael'
    },
    // agrega más proyectos de Rafael aquí
  ];
}
