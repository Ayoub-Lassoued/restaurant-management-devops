CREATE DATABASE IF NOT EXISTS restaurant_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurant_db;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dishes_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_dish
        FOREIGN KEY (dish_id) REFERENCES dishes(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    delivery_person VARCHAR(150) DEFAULT '',
    status ENUM('Waiting', 'Assigned', 'On the way', 'Delivered') NOT NULL DEFAULT 'Waiting',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
);

-- Initial Seed Data
INSERT INTO categories (name, description) VALUES
('Starters', 'Light appetizers and salads'),
('Main Courses', 'Hot dishes and specialties'),
('Pizzas', 'Wood-fired artisan pizzas'),
('Desserts', 'Homemade sweets and cakes'),
('Drinks', 'Soft drinks, juices, and coffee');

INSERT INTO dishes (name, description, price, category_id, image_url, is_available) VALUES
('Caesar Salad', 'Crisp romaine lettuce, parmesan, croutons, Caesar dressing', 12.50, 1, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', TRUE),
('Grilled Salmon', 'Fresh Atlantic salmon served with roasted vegetables', 28.00, 2, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', TRUE),
('Margherita Pizza', 'Tomato sauce, fresh mozzarella, and basil leaves', 15.00, 3, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', TRUE),
('Chocolate Fondant', 'Warm chocolate cake with molten center', 9.50, 4, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', TRUE),
('Fresh Orange Juice', '100% freshly squeezed oranges', 5.00, 5, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', TRUE);

INSERT INTO customers (name, phone) VALUES
('Youssef Ben Ali', '22123456'),
('Sarra Mansouri', '55987654');

INSERT INTO orders (customer_id, total_price, status) VALUES
(1, 35.00, 'Pending'),
(2, 28.00, 'Completed');

INSERT INTO order_items (order_id, dish_id, quantity, unit_price) VALUES
(1, 3, 2, 15.00),
(1, 5, 1, 5.00),
(2, 2, 1, 28.00);

INSERT INTO deliveries (order_id, address, delivery_person, status) VALUES
(1, '15 Avenue Habib Bourguiba, Nabeul', 'Karim Trabelsi', 'Assigned'),
(2, '42 Rue de la Plage, Hammamet', 'Mehdi Gharbi', 'Delivered');
