import { Routes } from '@angular/router';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeDetails } from './employee-details/employee-details';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeList, title: 'Employees' },
  { path: 'employees/:id', component: EmployeeDetails, title: 'Employee Details' },
];
