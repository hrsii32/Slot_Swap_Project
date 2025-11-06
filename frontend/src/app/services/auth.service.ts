import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, SignUpRequest } from '../interfaces/login';
import { UserResponse } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase + '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/login`, data).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }

  signup(data: SignUpRequest) {
    return this.http.post<UserResponse>(`${this.base}/signup`, data);
  }

  logout() { localStorage.removeItem('token'); }

  isLoggedIn() { return !!localStorage.getItem('token'); }
}
