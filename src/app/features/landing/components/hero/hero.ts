import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'hero-pro',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  scrollToPerfiles(){
    const perfilesSection = document.getElementById('perfiles');
    if (perfilesSection){
      perfilesSection.scrollIntoView({behavior: 'smooth'});
    }
  }
 }
