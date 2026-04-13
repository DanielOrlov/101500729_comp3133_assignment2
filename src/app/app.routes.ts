import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeDetails } from './employee-details/employee-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Sign Up' },

  {
    path: 'employees',
    component: EmployeeList,
    canActivate: [authGuard],
    title: 'Employees',
  },
  {
    path: 'employees/:id',
    component: EmployeeDetails,
    canActivate: [authGuard],
    title: 'Employee Details',
  },

  { path: '**', redirectTo: 'login' },
];
