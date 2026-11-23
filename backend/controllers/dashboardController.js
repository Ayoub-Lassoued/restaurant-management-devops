const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ total_dishes }]] = await pool.query('SELECT COUNT(*) AS total_dishes FROM dishes');
    const [[{ total_orders }]] = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
    const [[{ pending_orders }]] = await pool.query("SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'Pending'");
    const [[{ completed_orders }]] = await pool.query("SELECT COUNT(*) AS completed_orders FROM orders WHERE status = 'Completed'");

    res.json({
      total_dishes,
      total_orders,
      pending_orders,
      completed_orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error: error.message });
  }
};
