import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, Dish } from '../../models/restaurant.models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Menu Management</h3>
      <input type="text" class="form-control w-25" placeholder="Search dishes..." [(ngModel)]="searchTerm">
    </div>

    <div class="card stat-card p-4 bg-white mb-4">
      <h5 class="fw-bold mb-3">{{ editingId ? 'Edit Dish' : 'Add New Dish' }}</h5>
      <form (ngSubmit)="saveDish()" class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Dish Name</label>
          <input type="text" class="form-control" [(ngModel)]="form.name" name="name" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Price (TND)</label>
          <input type="number" step="0.5" class="form-control" [(ngModel)]="form.price" name="price" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Category</label>
          <select class="form-select" [(ngModel)]="form.category_id" name="category_id">
            <option [ngValue]="null">-- Select --</option>
            <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Image URL</label>
          <input type="text" class="form-control" [(ngModel)]="form.image_url" name="image_url" placeholder="https://...">
        </div>
        <div class="col-md-8">
          <label class="form-label">Description</label>
          <input type="text" class="form-control" [(ngModel)]="form.description" name="description">
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" [(ngModel)]="form.is_available" name="is_available" id="availCheck">
            <label class="form-check-label" for="availCheck">Available</label>
          </div>
        </div>
        <div class="col-md-2 d-flex align-items-end gap-2">
          <button type="submit" class="btn btn-orange w-100">{{ editingId ? 'Update' : 'Add' }}</button>
          <button *ngIf="editingId" type="button" class="btn btn-secondary" (click)="resetForm()">X</button>
        </div>
      </form>
    </div>

    <div class="card stat-card p-4 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Image</th>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let dish of filteredDishes">
              <td>
                <img [src]="dish.image_url || 'https://via.placeholder.com/60'" alt="" class="rounded" style="width: 55px; height: 45px; object-fit: cover;">
              </td>
              <td>
                <div class="fw-semibold">{{ dish.name }}</div>
                <small class="text-muted">{{ dish.description }}</small>
              </td>
              <td><span class="badge bg-secondary">{{ dish.category_name || 'Uncategorized' }}</span></td>
              <td class="fw-bold">{{ dish.price | number:'1.2-2' }} TND</td>
              <td>
                <button class="btn btn-sm" [ngClass]="dish.is_available ? 'btn-success' : 'btn-outline-secondary'" (click)="toggleAvailability(dish)">
                  {{ dish.is_available ? 'Available' : 'Unavailable' }}
                </button>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" (click)="editDish(dish)"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteDish(dish.id!)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {
  private api = inject(ApiService);
  dishes: Dish[] = [];
  categories: Category[] = [];
  searchTerm = '';
  editingId: number | null = null;
  form: Dish = { name: '', description: '', price: 0, category_id: null, image_url: '', is_available: true };

  ngOnInit(): void {
    this.loadData();
  }

  get filteredDishes(): Dish[] {
    const term = this.searchTerm.toLowerCase();
    return this.dishes.filter(d => d.name.toLowerCase().includes(term) || (d.category_name || '').toLowerCase().includes(term));
  }

  loadData(): void {
    this.api.getDishes().subscribe(data => (this.dishes = data));
    this.api.getCategories().subscribe(data => (this.categories = data));
  }

  saveDish(): void {
    if (!this.form.name.trim()) return;
    const req = this.editingId
      ? this.api.updateDish(this.editingId, this.form)
      : this.api.createDish(this.form);
    req.subscribe(() => {
      this.resetForm();
      this.loadData();
    });
  }

  editDish(dish: Dish): void {
    this.editingId = dish.id ?? null;
    this.form = { ...dish };
  }

  toggleAvailability(dish: Dish): void {
    this.api.toggleDishAvailability(dish.id!, !dish.is_available).subscribe(() => this.loadData());
  }

  deleteDish(id: number): void {
    if (confirm('Delete this dish?')) {
      this.api.deleteDish(id).subscribe(() => this.loadData());
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', description: '', price: 0, category_id: null, image_url: '', is_available: true };
  }
}
