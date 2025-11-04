import { Routes } from '@angular/router';
import { Layout } from './layout/public/layout';
import { LandingComponent } from './pages/public/landing/landing-component';
import { AuthenticatedUserLayout } from './layout/private/user/authenticated-user-layout';
import { UserHomeComponent } from './pages/private/user-home/user-home.component';
import { Login } from './pages/public/login/login';
import { HeaderAuth } from './layout/header-auth/header-auth';
import { Register } from './pages/public/register/register';
import { UserProfesoresComponent } from './pages/private/user-home/user-profesores/user-profesores.component';
import { AuthenticatedAdminDashboard } from './layout/private/admin/authenticated-admin-dashboard/authenticated-admin-dashboard';
import { UserManagement } from './pages/private/admin/user-management/user-management';
import { AdminDashboardHome } from './pages/private/admin/admin-dashboard-home/admin-dashboard-home';

export const routes: Routes = [
  { path: '', component: Layout, children: [{ path: '', component: LandingComponent }] },
  {
    path: 'private',
    component: AuthenticatedUserLayout,
    children: [
      { path: 'home', component: UserHomeComponent },
      { path: 'profesores', component: UserProfesoresComponent },
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
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
