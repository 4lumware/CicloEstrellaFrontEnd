import { Component, inject } from '@angular/core';
import { FormRegister } from './components/form-register/form-register';

@Component({
  selector: 'app-register',
  imports: [FormRegister],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}
