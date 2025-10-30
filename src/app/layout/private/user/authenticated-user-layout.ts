import { Component } from '@angular/core';
import {HeaderComponent} from './authenticated-user-header/header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './authenticated-user-layout.html',
  styleUrl: './authenticated-user-layout.css',
})
export class AuthenticatedUserLayout {

}
