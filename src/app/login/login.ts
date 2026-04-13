import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (result: any) => {
        const token = result?.data?.login?.token;
        const loggedInUsername = result?.data?.login?.user?.username;

        if (!token) {
          this.errorMessage = 'Login failed';
          return;
        }

        this.authService.setToken(token);

        if (loggedInUsername) {
          this.authService.setUsername(loggedInUsername);
        }

        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}
