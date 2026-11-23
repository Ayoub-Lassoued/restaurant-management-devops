import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, DashboardStats, Delivery, Dish, Order } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }
  createCategory(data: Category): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data);
  }
  updateCategory(id: number, data: Category): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data);
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // Dishes
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.baseUrl}/dishes`);
  }
  createDish(data: Dish): Observable<any> {
    return this.http.post(`${this.baseUrl}/dishes`, data);
  }
  updateDish(id: number, data: Dish): Observable<any> {
    return this.http.put(`${this.baseUrl}/dishes/${id}`, data);
  }
  toggleDishAvailability(id: number, is_available: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/dishes/${id}/availability`, { is_available });
  }
  deleteDish(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/dishes/${id}`);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }
  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, data);
  }
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${id}/status`, { status });
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/orders/${id}`);
  }

  // Deliveries
  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.baseUrl}/deliveries`);
  }
  createDelivery(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/deliveries`, data);
  }
  updateDelivery(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/deliveries/${id}`, data);
  }
  deleteDelivery(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deliveries/${id}`);
  }
}
