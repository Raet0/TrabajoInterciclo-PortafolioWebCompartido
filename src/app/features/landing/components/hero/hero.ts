import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hero-pro',
  imports: [],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  scrollToPerfiles() {
    const perfilesSection = document.getElementById('perfiles');
    if (perfilesSection) {
      perfilesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
