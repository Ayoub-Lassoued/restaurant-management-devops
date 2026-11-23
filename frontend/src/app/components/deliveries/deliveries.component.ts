import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Delivery } from '../../models/restaurant.models';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Delivery Management</h3>
      <input type="text" class="form-control w-25" placeholder="Search address or driver..." [(ngModel)]="searchTerm">
    </div>

    <div class="card stat-card p-4 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Delivery Address</th>
              <th>Delivery Person</th>
              <th>Status</th>
              <th class="text-end">Save</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let del of filteredDeliveries">
              <td class="fw-bold">#{{ del.order_id }}</td>
              <td>
                <div>{{ del.customer_name }}</div>
                <small class="text-muted">{{ del.customer_phone }}</small>
              </td>
              <td>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="del.address">
              </td>
              <td>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="del.delivery_person" placeholder="Assign driver">
              </td>
              <td>
                <select class="form-select form-select-sm" [(ngModel)]="del.status">
                  <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-orange" (click)="updateDelivery(del)">
                  <i class="bi bi-save"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DeliveriesComponent implements OnInit {
  private api = inject(ApiService);
  deliveries: Delivery[] = [];
  statuses = ['Waiting', 'Assigned', 'On the way', 'Delivered'];
  searchTerm = '';

  ngOnInit(): void {
    this.loadDeliveries();
  }

  get filteredDeliveries(): Delivery[] {
    const term = this.searchTerm.toLowerCase();
    return this.deliveries.filter(d =>
      d.address.toLowerCase().includes(term) ||
      (d.delivery_person || '').toLowerCase().includes(term) ||
      (d.customer_name || '').toLowerCase().includes(term)
    );
  }

  loadDeliveries(): void {
    this.api.getDeliveries().subscribe(data => (this.deliveries = data));
  }

  updateDelivery(del: Delivery): void {
    this.api.updateDelivery(del.id, {
      address: del.address,
      delivery_person: del.delivery_person,
      status: del.status
    }).subscribe(() => this.loadDeliveries());
  }
}
