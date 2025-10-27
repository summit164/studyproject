// Adapter switch: use PostgreSQL if DB_TYPE=postgres, otherwise SQLite (better-sqlite3)
if ((process.env.DB_TYPE || '').toLowerCase() === 'postgres') {
  module.exports = require('./db.postgres');
} else {
  const Database = require('better-sqlite3');
  const path = require('path');

  // DB file path is configurable via env; defaults to backend/data.sqlite
  const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data.sqlite');

  let db;

  function init() {
    if (db) return db;
    db = new Database(DB_FILE);
    db.pragma('journal_mode = WAL');

    // Create tables if not exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT NOT NULL,
        helperId TEXT,
        studentName TEXT,
        contact TEXT,
        subject TEXT,
        course TEXT,
        grade TEXT,
        message TEXT,
        forwarded INTEGER DEFAULT 0
      );
    `);
    return db;
  }

  async function insertOrder(order) {
    const nowIso = new Date().toISOString();
    const stmt = init().prepare(`
      INSERT INTO orders (createdAt, helperId, studentName, contact, subject, course, grade, message, forwarded)
      VALUES (@createdAt, @helperId, @studentName, @contact, @subject, @course, @grade, @message, @forwarded)
    `);
    const info = stmt.run({
      createdAt: nowIso,
      helperId: order.helperId || null,
      studentName: order.studentName || null,
      contact: order.contact || null,
      subject: order.subject || null,
      course: order.course || null,
      grade: order.grade || null,
      message: order.message || null,
      forwarded: order.forwarded ? 1 : 0,
    });
    return { id: info.lastInsertRowid, createdAt: nowIso };
  }

  async function listOrders(limit = 100, offset = 0) {
    const stmt = init().prepare(`SELECT * FROM orders ORDER BY id DESC LIMIT ? OFFSET ?`);
    return stmt.all(limit, offset);
  }

  async function getOrder(id) {
    const stmt = init().prepare(`SELECT * FROM orders WHERE id = ?`);
    return stmt.get(id);
  }

  async function markForwarded(id, forwarded = true) {
    const stmt = init().prepare(`UPDATE orders SET forwarded = ? WHERE id = ?`);
    stmt.run(forwarded ? 1 : 0, id);
  }

  module.exports = {
    init,
    insertOrder,
    listOrders,
    getOrder,
    markForwarded,
  };
}