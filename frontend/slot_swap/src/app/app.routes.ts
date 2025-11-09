import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./components/login/login.component')
                                 .then(m => m.LoginComponent) },

  { path: 'signup', loadComponent: () => import('./components/signup/signup.component')
                                  .then(m => m.SignupComponent) },

  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component')
                                      .then(m => m.DashboardComponent), canActivate: [authGuard] },

  { path: 'marketplace', loadComponent: () => import('./components/marketplace/marketplace.component')
                                           .then(m => m.MarketplaceComponent), canActivate: [authGuard] },

  { path: 'swaps', loadComponent: () => import('./components/swap-requests/swap-requests.component')
                                     .then(m => m.SwapRequestsComponent), canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
