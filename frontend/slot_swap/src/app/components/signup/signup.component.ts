import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, RouterLink],
  templateUrl: './signup.component.html'
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
