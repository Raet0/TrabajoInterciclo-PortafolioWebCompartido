import { Pipe, PipeTransform } from '@angular/core';
import type { Asesoria } from '../../models';

@Pipe({ name: 'filterHistory', standalone: true })
export class FilterHistoryPipe implements PipeTransform {
  transform(value: Asesoria[]): Asesoria[] {
    return value?.filter(a => a.estado !== 'pendiente') || [];
  }
}
