import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar-landing-component',
  imports: [
    RouterLink

  ],
  templateUrl: './navbar-landing-component.html',
  styleUrl: './navbar-landing-component.css',
})
export class NavbarLandingComponent {
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
