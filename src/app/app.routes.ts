import { Routes } from '@angular/router';
import { Layout } from './layout/public/layout';
import { LandingComponent } from './pages/public/landing/landing-component';
import { AuthenticatedUserLayout } from './layout/private/user/authenticated-user-layout';
import { Login } from './pages/public/login/login';
import { Register } from './pages/public/register/register';
import { AuthenticatedAdminDashboard } from './layout/private/admin/authenticated-admin-dashboard/authenticated-admin-dashboard';
import { UserManagement } from './pages/private/admin/user-management/user-management';
import { AdminDashboardHome } from './pages/private/admin/admin-dashboard-home/admin-dashboard-home';
import { UserHomeComponent } from './pages/private/user/user-home.component';
import { UserProfesoresComponent } from './pages/private/user/user-profesores/user-profesores.component';
import { Formality } from './pages/private/user/formality/formality';
import { StudentProfile } from './pages/private/user-profiles/student-profile/student-profile';
import { StudentProfileEdit } from './pages/private/user-profiles/student-profile/student-profile-edit/student-profile-edit';
import { Solicitudes } from './pages/private/admin/solicitudes/solicitudes';
import { Gestion } from './pages/private/admin/gestion/gestion';
import {Library} from './pages/private/user/library/library';

export const routes: Routes = [
  { path: '', component: Layout, children: [{ path: '', component: LandingComponent }] },
  {
    path: 'private',
    component: AuthenticatedUserLayout,
    children: [
      { path: 'home', component: UserHomeComponent },
      { path: 'profesores', component: UserProfesoresComponent },
      { path: 'tramites', component: Formality },
      { path: 'biblioteca', component: Library },
      { path: 'student', component: StudentProfile },
      { path: 'student/edit', component: StudentProfileEdit },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: AuthenticatedAdminDashboard,
    children: [
      {
        path: 'home',
        component: AdminDashboardHome,
      },
      {
        path: 'usuarios',
        component: UserManagement,
      },
      {
        path: 'solicitudes',
        component: Solicitudes,
      },
      {
        path: 'gestion',
        component: Gestion,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
