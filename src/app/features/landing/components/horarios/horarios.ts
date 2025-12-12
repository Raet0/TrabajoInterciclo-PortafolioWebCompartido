import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-horarios',
  imports: [],
  templateUrl: './horarios.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Horarios {
  userService = inject(UserService);

  // Función para determinar quién puede editar qué tabla
  canEdit(programador: 'rafael' | 'adrian'): boolean {
    const user = this.userService.userProfile();
    if (!user) return false;

    // El ADMIN puede editar todo
    if (user.rol === 'admin') return true;

    // Logica para programadores individuales
    // Suponiendo que el email o nombre distingue quién es quién
    if (user.rol === 'programador') {
      if (programador === 'rafael' && user.nombre.toLowerCase().includes('rafael')) return true;
      if (programador === 'adrian' && user.nombre.toLowerCase().includes('adrian')) return true;
    }

    return false;
  }
 }
