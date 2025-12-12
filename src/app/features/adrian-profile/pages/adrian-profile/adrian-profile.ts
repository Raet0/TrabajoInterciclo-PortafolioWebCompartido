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
  selector: 'app-adrian-profile',
  templateUrl: './adrian-profile.html',
})
export class AdrianProfile {
  projects: Project[] = [
    {
      id: 1,
      title: 'Portfolio Web Compartido',
      description: 'Aplicación web multiusuario para gestión de portafolios y proyectos.',
      image: 'assets/images/proyecto1-adrian.png',
      technologies: ['Angular', 'NestJS', 'Firebase'],
      github: 'https://github.com/scomygod/TrabajoInterciclo-PortafolioWebCompartido',
      demo: '#',
      author: 'Adrian'
    },
    {
      id: 2,
      title: 'Gestión de Clientes',
      description: 'Sistema CRUD para clientes y proveedores con interfaz web.',
      image: 'assets/images/proyecto2-adrian.png',
      technologies: ['Spring Boot', 'PostgreSQL'],
      github: 'https://github.com/scomygod/SistemaClientes',
      demo: '#',
      author: 'Adrian'
    },
    // agrega más proyectos de Adrian aquí
  ];
}
