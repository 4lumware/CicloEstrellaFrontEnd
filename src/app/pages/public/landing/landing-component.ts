import {Component, inject, OnInit} from '@angular/core';
import { HeroComponent } from './hero-component/hero-component';
import { AboutComponent } from './about-component/about-component';
import { FeaturesComponent } from './features-component/features-component';
import { TestimonialsComponent } from './testimonials-component/testimonials-component';
import { CtaComponent } from './cta-component/cta-component';
import { MatButtonModule } from '@angular/material/button';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-landing-component',
  imports: [
    HeroComponent,
    AboutComponent,
    FeaturesComponent,
    TestimonialsComponent,
    CtaComponent,
    MatButtonModule,
  ],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent{
}
