import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee';
import { RouterLink } from '@angular/router';
import { Router } from 'express';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { EmployeeEditModal } from '../employee-edit-modal/employee-edit-modal';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, EmployeeEditModal, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  showEditModal = false;
  showAddModal = false;
  selectedEmployee: any = null;

  searchText = '';
  isSearching = false;

  addForm: FormGroup = this.fb.group({
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

  openAddModal(): void {
    this.showAddModal = true;
    this.addForm.reset();
  }

  selectedAddPhotoFile: File | null = null;
  isUploadingAddPhoto = false;
  addPhotoPreview = '';

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(emp: any): void {
    this.selectedEmployee = emp;
    this.showEditModal = true;
  }

  onEmployeeUpdated(): void {
    this.closeEditModal();
    this.loadEmployees();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployee = null;
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

  saveNewEmployee(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const formValue = this.addForm.value;

    const newEmployee = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: formValue.email,
      department: formValue.department,
      designation: formValue.designation,
      gender: formValue.gender,
      salary: Number(formValue.salary),
      date_of_joining: formValue.date_of_joining,
    };

    this.isUploadingAddPhoto = true;

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (result: any) => {
        const createdEmployeeId = result?.data?.createEmployee?._id;

        if (!createdEmployeeId) {
          this.isUploadingAddPhoto = false;
          alert('Employee created, but no ID was returned');
          return;
        }

        if (this.selectedAddPhotoFile) {
          this.employeeService
            .uploadEmployeePhoto(createdEmployeeId, this.selectedAddPhotoFile)
            .subscribe({
              next: () => {
                this.isUploadingAddPhoto = false;
                this.closeAddModal();
                this.loadEmployees();
              },
              error: (error) => {
                this.isUploadingAddPhoto = false;
                console.error('Photo upload failed:', error);
                alert('Employee was created, but photo upload failed');
                this.closeAddModal();
                this.loadEmployees();
              },
            });
        } else {
          this.isUploadingAddPhoto = false;
          this.closeAddModal();
          this.loadEmployees();
        }
      },
      error: (error) => {
        this.isUploadingAddPhoto = false;
        console.error('Error adding employee:', error);
        alert('Failed to add employee');
      },
    });
  }

  deleteEmployee(id: string, name: string): void {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);

    if (!confirmed) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: (result) => {
        console.log('Employee deleted successfully:', result);
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      },
    });
  }

  onAddPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedAddPhotoFile = file;

    if (file) {
      this.addPhotoPreview = URL.createObjectURL(file);
    } else {
      this.addPhotoPreview = '';
    }
  }

  searchEmployees(): void {
    const query = this.searchText.trim();

    if (!query) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.isSearching = true;

    this.employeeService.searchEmployees(query).subscribe({
      next: (result: any) => {
        this.employees = result?.data?.findEmployeesByDesignationOrDepartment ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching employees:', error);
        this.errorMessage = 'Failed to search employees';
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.isSearching = false;
    this.loadEmployees();
  }
}
