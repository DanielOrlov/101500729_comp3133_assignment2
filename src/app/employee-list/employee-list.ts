import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  employees = [
    {
      _id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      department: 'IT',
      position: 'Developer',
    },
    {
      _id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      department: 'HR',
      position: 'Manager',
    },
  ];
}
