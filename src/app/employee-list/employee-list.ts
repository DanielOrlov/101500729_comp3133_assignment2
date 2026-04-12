import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);

  employees: any[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    console.log('EmployeeListComponent initialized');

    this.employeeService.getEmployees().subscribe({
      next: (result: any) => {
        console.log('GraphQL result:', result);
        this.employees = result?.data?.employees ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('GraphQL error:', error);
        this.errorMessage = 'Failed to load employees';
        this.loading = false;
      },
    });
  }
}
