export interface DashboardStats {
  total_dishes: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export interface Dish {
  id?: number;
  name: string;
  description: string;
  price: number;
  category_id: number | null;
  category_name?: string;
  image_url: string;
  is_available: boolean;
}

export interface OrderItem {
  dish_id: number;
  dish_name?: string;
  quantity: number;
  unit_price?: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface Delivery {
  id: number;
  order_id: number;
  address: string;
  delivery_person: string;
  status: 'Waiting' | 'Assigned' | 'On the way' | 'Delivered';
  customer_name?: string;
  customer_phone?: string;
  total_price?: number;
}
