const pool = require('../config/db');

exports.getAllDeliveries = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT del.id, del.order_id, del.address, del.delivery_person, del.status, del.updated_at,
             o.total_price, o.status AS order_status,
             c.name AS customer_name, c.phone AS customer_phone
      FROM deliveries del
      JOIN orders o ON del.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      ORDER BY del.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { order_id, address, delivery_person, status } = req.body;
    if (!order_id || !address) {
      return res.status(400).json({ message: 'Order ID and delivery address are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO deliveries (order_id, address, delivery_person, status) VALUES (?, ?, ?, ?)',
      [order_id, address.trim(), delivery_person || '', status || 'Waiting']
    );
    res.status(201).json({ id: result.insertId, message: 'Delivery created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery', error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, delivery_person, status } = req.body;
    const allowed = ['Waiting', 'Assigned', 'On the way', 'Delivered'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const [result] = await pool.query(
      'UPDATE deliveries SET address = ?, delivery_person = ?, status = ? WHERE id = ?',
      [address, delivery_person || '', status || 'Waiting', id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Delivery not found' });

    // Si la livraison est "Delivered", passer automatiquement la commande à "Completed"
    if (status === 'Delivered') {
      await pool.query(
        'UPDATE orders SET status = ? WHERE id = (SELECT order_id FROM deliveries WHERE id = ?)',
        ['Completed', id]
      );
    }

    res.json({ message: 'Delivery updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery', error: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM deliveries WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting delivery', error: error.message });
  }
};
