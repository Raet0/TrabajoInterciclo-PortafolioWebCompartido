import { Pipe, PipeTransform } from '@angular/core';
import type { Asesoria } from '../../models';

@Pipe({ name: 'filterPending', standalone: true })
export class FilterPendingPipe implements PipeTransform {
  transform(value: Asesoria[]): Asesoria[] {
    return value?.filter(a => a.estado === 'pendiente') || [];
  }
}
