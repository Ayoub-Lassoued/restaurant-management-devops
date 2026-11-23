import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Dish, Order } from '../../models/restaurant.models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Order Management</h3>
      <input type="text" class="form-control w-25" placeholder="Search customer..." [(ngModel)]="searchTerm">
    </div>

    <!-- Create Order -->
    <div class="card stat-card p-4 bg-white mb-4">
      <h5 class="fw-bold mb-3">Create New Order</h5>
      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label class="form-label">Customer Name</label>
          <input type="text" class="form-control" [(ngModel)]="customerName" placeholder="e.g. Ali Ben Salah">
        </div>
        <div class="col-md-4">
          <label class="form-label">Phone Number</label>
          <input type="text" class="form-control" [(ngModel)]="customerPhone" placeholder="e.g. 22123456">
        </div>
        <div class="col-md-4">
          <label class="form-label">Delivery Address (Optional)</label>
          <input type="text" class="form-control" [(ngModel)]="deliveryAddress" placeholder="Leave empty for dine-in/pickup">
        </div>
      </div>

      <div class="row g-2 align-items-end mb-3">
        <div class="col-md-6">
          <label class="form-label">Select Dish</label>
          <select class="form-select" [(ngModel)]="selectedDishId">
            <option [ngValue]="null">-- Choose available dish --</option>
            <option *ngFor="let d of availableDishes" [ngValue]="d.id">{{ d.name }} ({{ d.price | number:'1.2-2' }} TND)</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">Quantity</label>
          <input type="number" min="1" class="form-control" [(ngModel)]="selectedQty">
        </div>
        <div class="col-md-4">
          <button type="button" class="btn btn-dark w-100" (click)="addItemToCart()">
            <i class="bi bi-plus-lg me-1"></i> Add Dish to Order
          </button>
        </div>
      </div>

      <div *ngIf="cart.length > 0" class="border rounded p-3 mb-3 bg-light">
        <div *ngFor="let item of cart; let i = index" class="d-flex justify-content-between align-items-center mb-1">
          <span>{{ item.dish_name }} x {{ item.quantity }}</span>
          <div>
            <span class="fw-semibold me-3">{{ (item.unit_price * item.quantity) | number:'1.2-2' }} TND</span>
            <button class="btn btn-sm btn-outline-danger py-0" (click)="removeCartItem(i)">x</button>
          </div>
        </div>
        <hr class="my-2">
        <div class="d-flex justify-content-between fw-bold fs-5">
          <span>Total:</span>
          <span class="text-warning">{{ cartTotal | number:'1.2-2' }} TND</span>
        </div>
      </div>

      <button class="btn btn-orange" (click)="submitOrder()" [disabled]="cart.length === 0 || !customerName || !customerPhone">
        <i class="bi bi-check2-circle me-1"></i> Place Order
      </button>
    </div>

    <!-- Orders Table -->
    <div class="card stat-card p-4 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td class="fw-bold">#{{ order.id }}</td>
              <td>
                <div>{{ order.customer_name }}</div>
                <small class="text-muted">{{ order.customer_phone }}</small>
              </td>
              <td>
                <div *ngFor="let it of order.items" class="small">{{ it.dish_name }} (x{{ it.quantity }})</div>
              </td>
              <td class="fw-bold">{{ order.total_price | number:'1.2-2' }} TND</td>
              <td>
                <select class="form-select form-select-sm" [ngModel]="order.status" (ngModelChange)="changeStatus(order.id, $event)">
                  <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" (click)="deleteOrder(order.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  private api = inject(ApiService);
  orders: Order[] = [];
  dishes: Dish[] = [];
  statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  searchTerm = '';

  customerName = '';
  customerPhone = '';
  deliveryAddress = '';
  selectedDishId: number | null = null;
  selectedQty = 1;
  cart: { dish_id: number; dish_name: string; unit_price: number; quantity: number }[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  get availableDishes(): Dish[] {
    return this.dishes.filter(d => d.is_available);
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  get filteredOrders(): Order[] {
    const term = this.searchTerm.toLowerCase();
    return this.orders.filter(o => o.customer_name.toLowerCase().includes(term) || String(o.id).includes(term));
  }

  loadData(): void {
    this.api.getOrders().subscribe(data => (this.orders = data));
    this.api.getDishes().subscribe(data => (this.dishes = data));
  }

  addItemToCart(): void {
    const dish = this.dishes.find(d => d.id === Number(this.selectedDishId));
    if (!dish) return;
    const existing = this.cart.find(i => i.dish_id === dish.id);
    if (existing) {
      existing.quantity += Number(this.selectedQty) || 1;
    } else {
      this.cart.push({
        dish_id: dish.id!,
        dish_name: dish.name,
        unit_price: Number(dish.price),
        quantity: Number(this.selectedQty) || 1
      });
    }
    this.selectedDishId = null;
    this.selectedQty = 1;
  }

  removeCartItem(index: number): void {
    this.cart.splice(index, 1);
  }

  submitOrder(): void {
    this.api.createOrder({
      customer_name: this.customerName,
      customer_phone: this.customerPhone,
      delivery_address: this.deliveryAddress,
      items: this.cart.map(c => ({ dish_id: c.dish_id, quantity: c.quantity }))
    }).subscribe(() => {
      this.customerName = '';
      this.customerPhone = '';
      this.deliveryAddress = '';
      this.cart = [];
      this.loadData();
    });
  }

  changeStatus(id: number, status: string): void {
    this.api.updateOrderStatus(id, status).subscribe(() => this.loadData());
  }

  deleteOrder(id: number): void {
    if (confirm('Delete this order?')) {
      this.api.deleteOrder(id).subscribe(() => this.loadData());
    }
  }
}
