const pool = require('../config/db');

exports.getAllDishes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, c.name AS category_name
      FROM dishes d
      LEFT JOIN categories c ON d.category_id = c.id
      ORDER BY d.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
};

exports.createDish = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, is_available } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Dish name and price are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO dishes (name, description, price, category_id, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), description || '', Number(price), category_id || null, image_url || '', is_available !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'Dish created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating dish', error: error.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, is_available } = req.body;
    const [result] = await pool.query(
      'UPDATE dishes SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, is_available = ? WHERE id = ?',
      [name.trim(), description || '', Number(price), category_id || null, image_url || '', Boolean(is_available), id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating dish', error: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;
    const [result] = await pool.query(
      'UPDATE dishes SET is_available = ? WHERE id = ?',
      [Boolean(is_available), id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish availability updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM dishes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting dish', error: error.message });
  }
};
