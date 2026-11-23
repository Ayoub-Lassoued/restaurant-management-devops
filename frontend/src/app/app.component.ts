import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex">
      <!-- Sidebar -->
      <aside class="sidebar d-flex flex-column p-3">
        <div class="d-flex align-items-center mb-4 px-2">
          <i class="bi bi-shop fs-3 text-warning me-2"></i>
          <span class="fs-5 fw-bold">RestoManager</span>
        </div>
        <ul class="nav flex-column mb-auto">
          <li class="nav-item">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <i class="bi bi-speedometer2 me-2"></i> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/menu" routerLinkActive="active" class="nav-link">
              <i class="bi bi-book me-2"></i> Menu
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/categories" routerLinkActive="active" class="nav-link">
              <i class="bi bi-tags me-2"></i> Categories
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/orders" routerLinkActive="active" class="nav-link">
              <i class="bi bi-receipt me-2"></i> Orders
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/deliveries" routerLinkActive="active" class="nav-link">
              <i class="bi bi-truck me-2"></i> Deliveries
            </a>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <div class="flex-grow-1 d-flex flex-column min-vh-100">
        <nav class="navbar topbar px-4 py-3">
          <span class="navbar-brand mb-0 h5 fw-semibold text-dark">Restaurant Management System</span>
          <span class="badge bg-dark px-3 py-2">
            <i class="bi bi-circle-fill text-success me-1" style="font-size: 0.6rem;"></i> System Online
          </span>
        </nav>

        <main class="p-4 flex-grow-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {}
