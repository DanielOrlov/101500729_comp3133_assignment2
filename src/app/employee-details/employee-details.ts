import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../services/employee';
import { EmployeeEditModal } from '../employee-edit-modal/employee-edit-modal';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeEditModal],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  showEditModal = false;

  employee: any = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEmployee();
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEmployeeUpdated(): void {
    this.closeEditModal();
    this.loadEmployee();
  }

  loadEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Employee ID is missing';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (result: any) => {
        this.employee = result?.data?.employee ?? null;
        this.errorMessage = this.employee ? '' : 'Employee not found';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
        this.employee = null;
        this.errorMessage = 'Failed to load employee details';
        this.loading = false;
      },
    });
  }

  deleteEmployee(): void {
    if (!this.employee?._id) return;

    const fullName = `${this.employee.first_name} ${this.employee.last_name}`;
    const confirmed = window.confirm(`Are you sure you want to delete ${fullName}?`);

    if (!confirmed) return;

    this.employeeService.deleteEmployee(this.employee._id).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      },
    });
  }

  salaryFormatter(salary: number): string {
    return '$' + salary.toLocaleString();
  }
}
