import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/restaurant.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h3 class="fw-bold mb-4">Dashboard Overview</h3>

    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card stat-card p-3 bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="text-muted mb-1 small text-uppercase">Total Dishes</p>
              <h2 class="fw-bold mb-0">{{ stats.total_dishes }}</h2>
            </div>
            <i class="bi bi-book fs-1 text-warning"></i>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stat-card p-3 bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="text-muted mb-1 small text-uppercase">Total Orders</p>
              <h2 class="fw-bold mb-0">{{ stats.total_orders }}</h2>
            </div>
            <i class="bi bi-receipt fs-1 text-primary"></i>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stat-card p-3 bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="text-muted mb-1 small text-uppercase">Pending Orders</p>
              <h2 class="fw-bold mb-0 text-warning">{{ stats.pending_orders }}</h2>
            </div>
            <i class="bi bi-hourglass-split fs-1 text-warning"></i>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stat-card p-3 bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="text-muted mb-1 small text-uppercase">Completed Orders</p>
              <h2 class="fw-bold mb-0 text-success">{{ stats.completed_orders }}</h2>
            </div>
            <i class="bi bi-check-circle fs-1 text-success"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="card stat-card p-4 bg-white">
      <h5 class="fw-bold mb-3">Quick Actions</h5>
      <div class="d-flex flex-wrap gap-2">
        <a routerLink="/menu" class="btn btn-orange"><i class="bi bi-plus-circle me-1"></i> Manage Menu</a>
        <a routerLink="/orders" class="btn btn-dark"><i class="bi bi-cart-plus me-1"></i> New Order</a>
        <a routerLink="/deliveries" class="btn btn-outline-dark"><i class="bi bi-truck me-1"></i> Track Deliveries</a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats: DashboardStats = { total_dishes: 0, total_orders: 0, pending_orders: 0, completed_orders: 0 };

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error(err)
    });
  }
}
