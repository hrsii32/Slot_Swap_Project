import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // ✅ Add RouterLink import
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],     // ✅ Add RouterLink here
  template: `
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Login</h3>
          <form (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input class="form-control" type="email" [(ngModel)]="email" name="email" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input class="form-control" type="password" [(ngModel)]="password" name="password" required>
            </div>
            <button class="btn btn-primary" [disabled]="loading">Login</button>
            <a class="btn btn-link" routerLink="/signup">Create account</a>
            <div class="text-danger mt-2" *ngIf="error">{{error}}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (e) => {
        this.error = e?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
