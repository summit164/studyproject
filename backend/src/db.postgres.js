const { Pool } = require('pg');

let pool;

function init() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set for PostgreSQL');
  }
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  // Create table and index if not exist
  const create = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      helperId TEXT,
      studentName TEXT,
      contact TEXT,
      subject TEXT,
      course TEXT,
      grade TEXT,
      message TEXT,
      forwarded BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;
  const index = `CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt DESC)`;
  // Ensure index after table exists (fire-and-forget but sequenced)
  (async () => {
    try {
      await pool.query(create);
      await pool.query(index);
    } catch (e) {
      console.error('Postgres init failed:', e);
    }
  })();
  return pool;
}

async function insertOrder(order) {
  init();
  const text = `
    INSERT INTO orders (helperId, studentName, contact, subject, course, grade, message, forwarded)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, createdAt as "createdAt"
  `;
  const values = [
    order.helperId || null,
    order.studentName || null,
    order.contact || null,
    order.subject || null,
    order.course || null,
    order.grade || null,
    order.message || null,
    !!order.forwarded,
  ];
  const { rows } = await pool.query(text, values);
  return rows[0];
}

async function listOrders(limit = 100, offset = 0) {
  init();
  const { rows } = await pool.query(
    'SELECT id, createdAt as "createdAt", helperId as "helperId", studentName as "studentName", contact as "contact", subject as "subject", course as "course", grade as "grade", message as "message", forwarded as "forwarded" FROM orders ORDER BY id DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
}

async function getOrder(id) {
  init();
  const { rows } = await pool.query(
    'SELECT id, createdAt as "createdAt", helperId as "helperId", studentName as "studentName", contact as "contact", subject as "subject", course as "course", grade as "grade", message as "message", forwarded as "forwarded" FROM orders WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function markForwarded(id, forwarded = true) {
  init();
  await pool.query('UPDATE orders SET forwarded = $1 WHERE id = $2', [!!forwarded, id]);
}

module.exports = {
  init,
  insertOrder,
  listOrders,
  getOrder,
  markForwarded,
};