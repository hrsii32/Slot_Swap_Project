import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // ✅ Add RouterLink
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],     // ✅ Add RouterLink here too
  template: `
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Create Account</h3>
          <form (ngSubmit)="submit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Name</label>
                <input class="form-control" [(ngModel)]="name" name="name" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input class="form-control" type="email" [(ngModel)]="email" name="email" required>
              </div>
              <div class="col-12">
                <label class="form-label">Password</label>
                <input class="form-control" type="password" [(ngModel)]="password" name="password" required>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-success">Sign up</button>
              <a class="btn btn-link" routerLink="/login">Back to login</a>
            </div>
            <div class="text-danger mt-2" *ngIf="error">{{error}}</div>
            <div class="text-success mt-2" *ngIf="success">Account created! You can login now.</div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.success = false;
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigateByUrl('/login'), 800);
      },
      error: (e) => this.error = e?.error?.message || 'Signup failed'
    });
  }
}
