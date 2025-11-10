import { Component } from '@angular/core';
import {StudentProfileBasic} from './student-profile-basic/student-profile-basic';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-student-profile',
  imports: [
    StudentProfileBasic,
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfile {

}
