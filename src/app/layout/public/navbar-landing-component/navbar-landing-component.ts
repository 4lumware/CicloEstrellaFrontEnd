import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-landing-component',
  imports: [

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
