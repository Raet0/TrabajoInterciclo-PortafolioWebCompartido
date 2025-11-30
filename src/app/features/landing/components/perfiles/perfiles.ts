import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-perfiles',
  imports: [RouterLink],
  templateUrl: './perfiles.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Perfiles { }
