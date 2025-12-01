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
import { StudentProfile } from './pages/private/user/profile/student-profile/student-profile';
import { Library } from './pages/private/user/library/library';
import { hasRoleGuard } from './core/guards/has-role-guard';
import { CommentManagement } from './pages/private/admin/comment-management/comment-management';
import { ReviewManagement } from './pages/private/admin/review-management/review-management';
import { TeacherRequestsManagement } from './pages/private/admin/teacher-requests-management/teacher-requests-management';
import { TeacherManagement } from './pages/private/admin/teacher-management/teacher-management';
import { FormalityManagement } from './pages/private/admin/formality-management/formality-management';
import {ProfesorProfile} from './pages/private/user/user-profesores/profesor-profile/profesor-profile';
import { UserTeacherRequestsSearchForm } from './pages/private/user/teacher-requests/components/teacher-requests-search-form/teacher-requests-search-form';
import { TeacherRequestsComponent } from './pages/private/user/teacher-requests/teacher-requests.component';
import {FormalityProfile} from './pages/private/user/formality/formality-profile/formality-profile';

export const routes: Routes = [
  { path: '', component: Layout, children: [{ path: '', component: LandingComponent }] },
  {
    path: 'private',
    component: AuthenticatedUserLayout,
    canActivate: [hasRoleGuard(['STUDENT'])],
    children: [
      { path: 'home', component: UserHomeComponent },
      { path: 'profesores', component: UserProfesoresComponent },
      { path: 'profesor-profile/:id', component: ProfesorProfile },
      { path: 'tramites', component: Formality },
      { path: 'tramites/:id', component: FormalityProfile},
      { path: 'biblioteca', component: Library },
      { path: 'student', component: StudentProfile },
      { path: 'teacher-requests', component: TeacherRequestsComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
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
    canActivate: [hasRoleGuard(['ADMIN', 'MODERATOR', 'WRITER'])],
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
        path: 'comentarios',
        component: CommentManagement,
      },
      {
        path: 'reviews',
        component: ReviewManagement,
      },
      {
        path: 'teacher-requests',
        component: TeacherRequestsManagement,
      },
      {
        path: 'profesores',
        component: TeacherManagement,
      },
      {
        path: 'tramites',
        component: FormalityManagement,
      },

      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
