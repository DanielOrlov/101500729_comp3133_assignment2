import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  employee: any = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Employee ID is missing';
      this.loading = false;
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (result: any) => {
        this.employee = result?.data?.employee ?? null;

        if (this.employee) {
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Employee not found';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
        this.errorMessage = 'Failed to load employee details';
        this.loading = false;
      },
    });
  }
}
