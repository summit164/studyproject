"use client";

import { useState } from "react";

export default function QuickHelpPage() {
  const [helperId, setHelperId] = useState("helper-1");
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; forwarded?: boolean; error?: string; }>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!helperId || !studentName || !contact) {
      setResult({ ok: false, error: "Заполните хелпера, имя и контакт" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4004/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, studentName, contact, subject, grade, message }),
      });
      const data = await res.json();
      setResult({ ok: res.ok, forwarded: data?.forwarded, error: data?.error });
    } catch (err) {
      setResult({ ok: false, error: "Не удалось отправить заявку" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Быстрая заявка</h1>
      <p style={{ marginTop: 8, color: "#555" }}>
        Заполните форму и нажмите «Оформить заявку» — бот отправит сообщение в группу помощников.
      </p>

      <form onSubmit={submitOrder} style={{ marginTop: 20, display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Хелпер</span>
          <select value={helperId} onChange={(e) => setHelperId(e.target.value)} style={{ padding: 8 }}>
            <option value="helper-1">helper-1</option>
            <option value="helper-2">helper-2</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Имя студента</span>
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Иван" style={{ padding: 8 }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Контакт</span>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="@ivan или номер" style={{ padding: 8 }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Предмет</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Математика" style={{ padding: 8 }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Класс/курс</span>
          <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="10" style={{ padding: 8 }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Комментарий</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Кратко опишите задачу" rows={4} style={{ padding: 8 }} />
        </label>

        <button type="submit" disabled={loading} style={{ padding: "10px 16px", fontWeight: 600 }}>
          {loading ? "Отправка..." : "Оформить заявку"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 16 }}>
          {result.ok ? (
            <div style={{ color: "green" }}>
              Заявка отправлена{result.forwarded ? " и доставлена в группу" : ", но Telegram не настроен"}
            </div>
          ) : (
            <div style={{ color: "crimson" }}>Ошибка: {result.error || "проверьте сервер"}</div>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: 12, color: "#777" }}>
        Эндпоинт: http://localhost:4004/api/orders
      </div>
    </div>
  );
}