import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
  author: 'Rafael' | 'Adrian';
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProjects {
  projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Plataforma de comercio electrónico completa con carrito de compras, pagos y gestión de inventario.',
      image: '/assets/images/project1.jpg',
      technologies: ['Angular', 'Firebase', 'Tailwind CSS'],
      github: 'https://github.com/rafael/ecommerce',
      demo: 'https://ecommerce-demo.com',
      author: 'Rafael',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Aplicación de gestión de tareas con autenticación, colaboración en tiempo real y notificaciones.',
      image: '/assets/images/project2.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/adrian/taskapp',
      demo: 'https://taskapp-demo.com',
      author: 'Adrian',
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'Dashboard meteorológico con predicciones en tiempo real, mapas interactivos y gráficos.',
      image: '/assets/images/project3.jpg',
      technologies: ['Angular', 'API REST', 'Chart.js'],
      github: 'https://github.com/rafael/weather',
      demo: 'https://weather-demo.com',
      author: 'Rafael',
    },
    {
      id: 4,
      title: 'Social Media Clone',
      description: 'Red social con publicaciones, comentarios, likes y sistema de mensajería en tiempo real.',
      image: '/assets/images/project4.jpg',
      technologies: ['Vue.js', 'Express.js', 'PostgreSQL'],
      github: 'https://github.com/adrian/social',
      demo: 'https://social-demo.com',
      author: 'Adrian',
    },
  ];
} 