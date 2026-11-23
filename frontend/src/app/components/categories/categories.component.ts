import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/restaurant.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Categories</h3>
      <input type="text" class="form-control w-25" placeholder="Search categories..." [(ngModel)]="searchTerm">
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card stat-card p-4 bg-white">
          <h5 class="fw-bold mb-3">{{ editingId ? 'Edit Category' : 'Add Category' }}</h5>
          <form (ngSubmit)="saveCategory()">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.name" name="name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="form.description" name="description"></textarea>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-orange flex-grow-1">
                {{ editingId ? 'Update' : 'Add Category' }}
              </button>
              <button *ngIf="editingId" type="button" class="btn btn-secondary" (click)="resetForm()">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card stat-card p-4 bg-white">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cat of filteredCategories">
                <td>{{ cat.id }}</td>
                <td class="fw-semibold">{{ cat.name }}</td>
                <td>{{ cat.description }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="editCategory(cat)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteCategory(cat.id!)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  private api = inject(ApiService);
  categories: Category[] = [];
  searchTerm = '';
  editingId: number | null = null;
  form: Category = { name: '', description: '' };

  ngOnInit(): void {
    this.loadCategories();
  }

  get filteredCategories(): Category[] {
    const term = this.searchTerm.toLowerCase();
    return this.categories.filter(c => c.name.toLowerCase().includes(term));
  }

  loadCategories(): void {
    this.api.getCategories().subscribe(data => (this.categories = data));
  }

  saveCategory(): void {
    if (!this.form.name.trim()) return;
    if (this.editingId) {
      this.api.updateCategory(this.editingId, this.form).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    } else {
      this.api.createCategory(this.form).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    }
  }

  editCategory(cat: Category): void {
    this.editingId = cat.id ?? null;
    this.form = { name: cat.name, description: cat.description };
  }

  deleteCategory(id: number): void {
    if (confirm('Delete this category?')) {
      this.api.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', description: '' };
  }
}
