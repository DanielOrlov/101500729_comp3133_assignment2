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
    this.loadEmployees();
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
      date_of_joining: this.formatDateForInput(emp.date_of_joining),
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployeeId = '';
    this.editForm.reset();
  }

  formatDateForInput(dateValue: string): string {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toISOString().split('T')[0];
  }

  loadEmployees(): void {
    this.loading = true;

    this.employeeService.getEmployees().subscribe({
      next: (result: any) => {
        this.employees = result?.data?.employees ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.errorMessage = 'Failed to load employees';
        this.loading = false;
      },
    });
  }

  saveEmployeeChanges(): void {
    if (this.editForm.invalid || !this.selectedEmployeeId) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.value;

    const updatedEmployee = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: formValue.email,
      department: formValue.department,
      designation: formValue.designation,
      gender: formValue.gender,
      salary: Number(formValue.salary),
    };

    this.employeeService.updateEmployee(this.selectedEmployeeId, updatedEmployee).subscribe({
      next: (result) => {
        console.log('Employee updated successfully:', result);
        this.closeEditModal();
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        alert('Failed to update employee');
      },
    });
  }
}
