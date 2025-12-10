import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-pro',
  imports: [],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  scrollToPerfiles() {
    const perfilesSection = document.getElementById('perfiles');
    if (perfilesSection) {
      perfilesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToHome() {
    const homeSelection = document.getElementById('home');
    if (homeSelection) {
      homeSelection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
