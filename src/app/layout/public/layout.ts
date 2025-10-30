import { Component } from '@angular/core';
import {NavbarLandingComponent} from "./navbar-landing-component/navbar-landing-component";
import {FooterLandingComponent} from './footer-landing-component/footer-landing-component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    NavbarLandingComponent,
    FooterLandingComponent,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
