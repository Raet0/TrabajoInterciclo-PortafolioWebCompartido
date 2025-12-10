import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Drawer } from "../../components/drawer/drawer";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, RouterLinkActive, Drawer, Footer],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

}
