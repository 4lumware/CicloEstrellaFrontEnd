import { Component } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-library',
  imports: [
    MatIconButton,
    MatButton
  ],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {

}
