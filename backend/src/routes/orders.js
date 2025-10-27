const express = require('express');
const { Api } = require('grammy');
const { insertOrder, markForwarded, listOrders, getOrder } = require('../db');
const router = express.Router();

const token = process.env.TELEGRAM_BOT_TOKEN;
const groupId = process.env.TELEGRAM_HELPERS_GROUP_ID; // пример: -1001234567890
const api = token ? new Api(token) : null;

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

router.post('/', async (req, res) => {
  const { helperId, studentName, contact, message, subject, grade, course } = req.body || {};
  if (!helperId || !studentName || !contact) {
    return res.status(400).json({ error: 'Required fields: helperId, studentName, contact' });
  }

  // Сохраняем заявку в БД
  let orderIdInfo;
  try {
    orderIdInfo = await insertOrder({ helperId, studentName, contact, subject, grade, course, message, forwarded: false });
  } catch (err) {
    console.error('DB insert failed:', err);
    return res.status(500).json({ error: 'db_insert_failed' });
  }

  const order = {
    id: orderIdInfo.id,
    helperId,
    studentName,
    contact,
    subject: subject || '',
    grade: grade || '',
    course: course || '',
    message: message || '',
    createdAt: orderIdInfo.createdAt,
  };

  // Сформируем текст заявки для Telegram (HTML)
  const text = [
    '<b>Новая заявка</b>',
    `Хелпер: <code>${escapeHtml(helperId)}</code>`,
    `Студент: <b>${escapeHtml(studentName)}</b>`,
    `Контакт: ${escapeHtml(contact)}`,
    subject ? `Предмет: ${escapeHtml(subject)}` : null,
    grade ? `Класс/курс: ${escapeHtml(grade || course)}` : (course ? `Курс: ${escapeHtml(course)}` : null),
    order.message ? `Комментарий: ${escapeHtml(order.message)}` : null,
    `Время: ${escapeHtml(order.createdAt)}`,
  ].filter(Boolean).join('\n');

  // Отправка в Telegram‑группу, если настроено
  if (!api || !groupId) {
    return res.status(201).json({ status: 'created', order, forwarded: false, reason: 'Telegram not configured' });
  }

  try {
    await api.sendMessage(groupId, text, { parse_mode: 'HTML' });
    // помечаем forwarded в БД
    try { await markForwarded(order.id, true); } catch (e) { console.warn('DB markForwarded failed:', e); }
    return res.status(201).json({ status: 'created', order, forwarded: true });
  } catch (err) {
    console.error('Failed to send to Telegram:', err?.message || err);
    return res.status(201).json({ status: 'created', order, forwarded: false, error: 'telegram_send_failed' });
  }
});

// Получить список заявок
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 100;
  const offset = Number(req.query.offset) || 0;
  try {
    const orders = await listOrders(limit, offset);
    res.json({ orders, limit, offset });
  } catch (err) {
    console.error('DB list failed:', err);
    res.status(500).json({ error: 'db_list_failed' });
  }
});

// Получить заявку по id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid_id' });
  try {
    const order = await getOrder(id);
    if (!order) return res.status(404).json({ error: 'not_found' });
    res.json({ order });
  } catch (err) {
    console.error('DB get failed:', err);
    res.status(500).json({ error: 'db_get_failed' });
  }
});

module.exports = router;