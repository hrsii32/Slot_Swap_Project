import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], 
  template: `
  <div class="container my-4">
    <nav class="navbar navbar-expand navbar-light bg-light rounded px-3 mb-4">
      <a class="navbar-brand fw-semibold" routerLink="/">Slot Swap</a>
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><a class="nav-link" routerLink="/dashboard">My Events</a></li>
        <li class="nav-item"><a class="nav-link" routerLink="/marketplace">Marketplace</a></li>
        <li class="nav-item"><a class="nav-link" routerLink="/swaps">Swaps</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  </div>
  `
})
class AppRoot {}

bootstrapApplication(AppRoot, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
});
