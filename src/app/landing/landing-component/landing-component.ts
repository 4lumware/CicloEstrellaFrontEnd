import { Component } from '@angular/core';
import {NavbarLandingComponent} from '../../shared/navbar-landing-component/navbar-landing-component';
import {HeroComponent} from '../hero-component/hero-component';
import {AboutComponent} from '../about-component/about-component';
import {FeaturesComponent} from '../features-component/features-component';
import {TestimonialsComponent} from '../testimonials-component/testimonials-component';
import {CtaComponent} from '../cta-component/cta-component';
import {FooterLandingComponent} from '../../shared/footer-landing-component/footer-landing-component';

@Component({
  selector: 'app-landing-component',
  imports: [
    NavbarLandingComponent,
    HeroComponent,
    AboutComponent,
    FeaturesComponent,
    TestimonialsComponent,
    CtaComponent,
    FooterLandingComponent
  ],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent {

}
