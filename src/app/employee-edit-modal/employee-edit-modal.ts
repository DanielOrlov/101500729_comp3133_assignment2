import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-employee-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit-modal.html',
  styleUrl: './employee-edit-modal.css',
})
export class EmployeeEditModal implements OnChanges {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);

  selectedPhotoFile: File | null = null;
  photoPreview = '';

  @Input() employee: any = null;
  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  errorMessage = '';
  isSaving = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.editForm.patchValue({
        first_name: this.employee.first_name ?? '',
        last_name: this.employee.last_name ?? '',
        email: this.employee.email ?? '',
        department: this.employee.department ?? '',
        designation: this.employee.designation ?? '',
        salary: this.employee.salary ?? '',
        gender: this.employee.gender ?? '',
        date_of_joining: this.formatDateForInput(this.employee.date_of_joining),
      });

      this.photoPreview = this.employee.employee_photo ?? '';
      this.selectedPhotoFile = null;
      this.errorMessage = '';
    }

    if (changes['isOpen'] && !this.isOpen) {
      this.editForm.reset();
      this.errorMessage = '';
      this.isSaving = false;
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedPhotoFile = file;

    if (file) {
      this.photoPreview = URL.createObjectURL(file);
    } else {
      this.photoPreview = this.employee?.employee_photo ?? '';
    }
  }

  private formatDateForInput(dateValue: string): string {
    if (!dateValue) return '';
    return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
  }

  closeModal(): void {
    this.closed.emit();
  }

  saveChanges(): void {
    if (this.editForm.invalid || !this.employee?._id) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.editForm.value;

    const updatedEmployee = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: formValue.email,
      department: formValue.department,
      designation: formValue.designation,
      gender: formValue.gender,
      salary: Number(formValue.salary),
      date_of_joining: formValue.date_of_joining,
    };

    const finalize = () => {
      this.isSaving = false;
      this.saved.emit(); // 🔥 THIS closes the modal
    };

    // Step 1: update employee fields
    this.employeeService.updateEmployee(this.employee._id, updatedEmployee).subscribe({
      next: () => {
        // Step 2: if photo exists, upload it
        if (this.selectedPhotoFile) {
          this.employeeService
            .uploadEmployeePhoto(this.employee._id, this.selectedPhotoFile)
            .subscribe({
              next: () => finalize(),
              error: (error) => {
                console.error('Photo upload failed:', error);
                this.errorMessage = 'Photo upload failed';
                this.isSaving = false;
              },
            });
        } else {
          finalize();
        }
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.errorMessage = 'Failed to update employee';
        this.isSaving = false;
      },
    });
  }
}
