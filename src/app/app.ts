import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeRepository } from './features/landing/services/localStorage-Theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('TrabajoInterciclo-PortafolioWebCompartido');

  constructor(private themeRepo: ThemeRepository) {}

  ngOnInit() {
    const savedTheme = this.themeRepo.getTheme() || 'light';
    this.themeRepo.setTheme(savedTheme);
  }
}
