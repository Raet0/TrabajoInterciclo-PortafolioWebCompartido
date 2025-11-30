import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { Footer } from "../../components/footer/footer";
import { BackToTop } from "../../components/back-to-top/back-to-top";
import { Perfiles } from "../../components/perfiles/perfiles";
import { Drawer } from "../../components/drawer/drawer";
import { ThemeSwitcher } from "../../components/theme-switcher/theme-switcher";

@Component({
  selector: 'app-landing',
  imports: [Hero, Footer, BackToTop, Perfiles, Drawer, ThemeSwitcher],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing { }
