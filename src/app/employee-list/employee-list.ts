import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee';
import { RouterLink } from '@angular/router';
import { Router } from 'express';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  showEditModal = false;
  selectedEmployeeId = '';

  editForm: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    designation: ['', Validators.required],
    salary: ['', Validators.required],
    gender: ['', Validators.required],
    date_of_joining: ['', Validators.required],
  });

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

  openEditModal(emp: any): void {
    this.selectedEmployeeId = emp._id;
    this.showEditModal = true;

    this.editForm.patchValue({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary,
      gender: emp.gender,
      date_of_joining: emp.date_of_joining,
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployeeId = '';
    this.editForm.reset();
  }
}
