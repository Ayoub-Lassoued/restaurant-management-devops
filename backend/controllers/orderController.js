const pool = require('../config/db');

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.total_price, o.status, o.created_at,
             c.id AS customer_id, c.name AS customer_name, c.phone AS customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.id DESC
    `);

    const [items] = await pool.query(`
      SELECT oi.order_id, oi.dish_id, oi.quantity, oi.unit_price, d.name AS dish_name
      FROM order_items oi
      JOIN dishes d ON oi.dish_id = d.id
    `);

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: items.filter(item => item.order_id === order.id)
    }));

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { customer_name, customer_phone, items, delivery_address } = req.body;
    if (!customer_name || !customer_phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer info and at least one dish are required' });
    }

    await connection.beginTransaction();

    const [customerResult] = await connection.query(
      'INSERT INTO customers (name, phone) VALUES (?, ?)',
      [customer_name.trim(), customer_phone.trim()]
    );
    const customerId = customerResult.insertId;

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const [[dish]] = await connection.query('SELECT id, price FROM dishes WHERE id = ?', [item.dish_id]);
      if (!dish) {
        await connection.rollback();
        return res.status(400).json({ message: `Dish ID ${item.dish_id} not found` });
      }
      const qty = Math.max(1, Number(item.quantity) || 1);
      totalPrice += Number(dish.price) * qty;
      validatedItems.push({ dish_id: dish.id, quantity: qty, unit_price: Number(dish.price) });
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, ?)',
      [customerId, totalPrice.toFixed(2), 'Pending']
    );
    const orderId = orderResult.insertId;

    for (const item of validatedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, dish_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.dish_id, item.quantity, item.unit_price]
      );
    }

    if (delivery_address && delivery_address.trim() !== '') {
      await connection.query(
        'INSERT INTO deliveries (order_id, address, delivery_person, status) VALUES (?, ?, ?, ?)',
        [orderId, delivery_address.trim(), '', 'Waiting']
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderId, total_price: totalPrice, message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error creating order', error: error.message });
  } finally {
    connection.release();
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
