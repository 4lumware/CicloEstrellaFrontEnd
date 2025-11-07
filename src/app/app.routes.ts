import { Routes } from '@angular/router';
import {Layout} from './layout/public/layout';
import {LandingComponent} from './pages/public/landing/landing-component';
import {AuthenticatedUserLayout} from './layout/private/user/authenticated-user-layout';
import {UserHomeComponent} from './pages/private/user-home/user-home.component';
import { UserProfesoresComponent } from './pages/private/user-home/user-profesores/user-profesores.component';


export const routes: Routes = [
  {path: '', component: Layout, children:[
    {path: '', component: LandingComponent},
    ]},
  {path: 'private', component: AuthenticatedUserLayout, children:[
      {path: 'home', component: UserHomeComponent},
      {path: 'profesores', component: UserProfesoresComponent}
    ]},
>>>>>>> Stashed changes
];
