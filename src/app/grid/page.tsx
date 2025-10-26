"use client";
import { BGPattern } from "@/components/ui/bg-pattern";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { User, Zap, X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Минимальная типизация Telegram WebApp, чтобы избежать explicit any
type TwaHeaderColor = "bg_color" | "secondary_bg_color" | string;
interface TwaWebApp {
  ready: () => void;
  expand: () => void;
  setBackgroundColor?: (color: string) => void;
  setHeaderColor?: (color: TwaHeaderColor) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TwaWebApp };
  }
}

export default function GridBackgroundDemo() {
  const [activeTab, setActiveTab] = useState<string>("Выбрать Хелпера");
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const gradeRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [gradebookFiles, setGradebookFiles] = useState<File[]>([]);
  const [helperFormOpen, setHelperFormOpen] = useState<boolean>(false);
  const [selectedHelper, setSelectedHelper] = useState<{
    name: string;
    course: string;
    subjects: string[];
    grade: string;
    photoUrl: string;
  } | null>(null);

  // Исходная форма «Быстрая заявка»: ровно как на скриншоте
  const [course, setCourse] = useState("");
  const [direction, setDirection] = useState("");
  const [subject, setSubject] = useState("");
  const [service, setService] = useState("Решение ДЗ");
  const [condition, setCondition] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<null | { ok: boolean; forwarded?: boolean; error?: string }>(null);

  useEffect(() => {
    try {
      const wa = window.Telegram?.WebApp;
      wa?.ready();
      wa?.expand();
      wa?.setBackgroundColor?.("#ffffff");
      wa?.setHeaderColor?.("bg_color");
    } catch {
      // noop
    }
  }, []);

  const helpers = [
    {
      name: "Макс Роговский",
      course: "3 курс, ФИТ",
      subjects: ["Алгебра", "Матанализ", "Программирование"],
      grade: "Senior",
      photoUrl: "",
    },
    {
      name: "Анна Петрова",
      course: "2 курс, Экономика",
      subjects: ["Статистика", "Эконометрика", "Excel"],
      grade: "Middle",
      photoUrl: "",
    },
    {
      name: "Илья Смирнов",
      course: "4 курс, МехМат",
      subjects: ["Диффуры", "Теория вероятностей", "Python"],
      grade: "Senior",
      photoUrl: "",
    },
  ];

  async function submitQuickForm() {
    setSendResult(null);
    setSending(true);
    try {
      const composedMessage = [
        course ? `Курс: ${course}` : null,
        direction ? `Направление: ${direction}` : null,
        subject ? `Предмет: ${subject}` : null,
        service ? `Услуга: ${service}` : null,
        condition ? `Условие: ${condition}` : null,
        amount ? `Сумма: ${amount} ₽` : null,
        attachedFile ? `Прикреплено: ${attachedFile.name}` : null,
      ].filter(Boolean).join("\n");

      const res = await fetch("http://localhost:4004/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helperId: selectedHelper?.name || "—",
          studentName: "—",
          contact: "—",
          subject,
          course,
          message: composedMessage,
        }),
      });
      const data = await res.json();
      setSendResult({ ok: res.ok, forwarded: data?.forwarded, error: data?.error });
    } catch (err) {
      setSendResult({ ok: false, error: "Не удалось отправить заявку" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 flex w-full flex-col items-center justify-center p-0 overflow-hidden">
      <BGPattern variant="grid" mask="none" fill="#000" />
      {/* Заголовок выше центра */}
      <div className="absolute top-12 sm:top-8 left-1/2 -translate-x-1/2">
        <TextShimmer
          duration={1.2}
          className="text-5xl sm:text-6xl font-bold [--base-color:#000] [--base-gradient-color:#000]"
        >
          StudyFlow
        </TextShimmer>
      </div>

      {/* Две кнопки по центру вертикально */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-72 sm:w-80">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="h-12 w-64 sm:h-12 sm:w-72 text-xl font-bold rounded-full mx-auto">Нужна помощь</Button>
            </DialogTrigger>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] h-[90vh] sm:h-[560px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-hidden">
              {/* Кнопка закрытия */}
              <DialogClose asChild>
                <button aria-label="Закрыть" className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
              {/* Навбар вкладок */}
              <div className="mt-5 sm:mt-6 grid grid-rows-[auto,1fr] h-full">
                 <NavBar
                   position="relative"
                   className="w-[90%] sm:w-[85%] max-w-[380px] sm:max-w-[420px] mx-auto"
                   items={[
                     { name: "Выбрать Хелпера", url: "#", icon: User },
                     { name: "Быстрая заявка", url: "#", icon: Zap },
                   ]}
                   onChange={(name) => setActiveTab(name)}
                 />
                 <div className="mt-3 sm:mt-4 overflow-y-auto min-h-0 pr-1 pb-3 sm:pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                   {activeTab === "Выбрать Хелпера" ? (
                     <div className="space-y-3">
                       {helpers.map((h) => (
                         <div
                           key={h.name}
                           className="flex items-center justify-between flex-nowrap gap-3 sm:gap-4 rounded-xl border border-border bg-white/50 dark:bg-white/10 backdrop-blur p-3 cursor-pointer hover:bg-white/70 dark:hover:bg-white/15 transition"
                           role="button"
                           onClick={() => {
                             setSelectedHelper(h);
                             setHelperFormOpen(true);
                           }}
                         >
                           <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-muted/50 border border-border" aria-label="Фото">
                             {/* Место для фото слева */}
                           </div>
                           <div className="flex-1 pl-3">
                             <div className="flex items-center justify-between gap-2">
                               <div>
                                 <div className="text-lg sm:text-xl font-semibold leading-tight">{h.name}</div>
                                 <div className="text-sm text-foreground/70 mt-0.5">{h.course}</div>
                               </div>
                               <div className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground text-sm font-semibold">
                                 {h.grade}
                               </div>
                             </div>
                             <div className="mt-2 flex flex-wrap gap-1.5">
                               {h.subjects.map((s) => (
                                 <span key={s} className="px-2 py-0.5 rounded-full bg-muted/70 text-foreground/80 text-xs">
                                   {s}
                                 </span>
                               ))}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : null}

                   {activeTab === "Быстрая заявка" ? (
                     <div>
                       <div className="rounded-xl border border-border bg-white/70 dark:bg-white/10 backdrop-blur p-3 sm:p-4">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                           <div>
                             <label className="block text-xs font-semibold text-foreground/80 mb-1">Курс</label>
                             <input value={course} onChange={(e)=>setCourse(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                           </div>
                           <div>
                             <label className="block text-xs font-semibold text-foreground/80 mb-1">Направление</label>
                             <input value={direction} onChange={(e)=>setDirection(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                           </div>
                           <div>
                             <label className="block text-xs font-semibold text-foreground/80 mb-1">Предмет</label>
                             <input value={subject} onChange={(e)=>setSubject(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                           </div>
                           <div>
                             <label className="block text-xs font-semibold text-foreground/80 mb-1">Услуга</label>
                             <select value={service} onChange={(e)=>setService(e.target.value)} className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm">
                               <option>Решение ДЗ</option>
                               <option>Контрольная</option>
                               <option>Консультация</option>
                             </select>
                           </div>
                         </div>
                         <div className="mt-3 sm:mt-4">
                           <div className="flex items-center justify-between">
                             <label className="text-xs font-semibold text-foreground/80">Условие</label>
                             <div className="flex items-center gap-2">
                               <input
                                 ref={fileRef}
                                 type="file"
                                 accept="image/*"
                                 className="hidden"
                                 onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)}
                               />
                               <button
                                 type="button"
                                 onClick={() => fileRef.current?.click()}
                                 className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                               >
                                 <ImageIcon className="w-4 h-4" /> Фото
                               </button>
                             </div>
                           </div>
                           <textarea rows={3}
                             value={condition}
                             onChange={(e)=>setCondition(e.target.value)}
                             className="mt-1 w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                           />
                           {attachedFile && (
                             <div className="mt-1 text-xs text-foreground/70">Прикреплено: {attachedFile.name}</div>
                           )}
                         </div>
                         <div className="mt-3 sm:mt-4">
                           <label className="block text-xs font-semibold text-foreground/80">Сумма</label>
                           <div className="relative">
                             <input value={amount} onChange={(e)=>setAmount(e.target.value)} type="text" inputMode="decimal"
                               className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 pr-10 text-sm"
                             />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 text-sm">₽</span>
                           </div>
                         </div>
                         <div className="mt-3 sm:mt-4">
                           <Button
                             onClick={submitQuickForm}
                             disabled={sending}
                             variant="outline"
                             size="lg"
                             className="h-10 w-full sm:w-auto px-4 font-bold"
                           >
                             {sending ? "Отправка..." : "Оформить заявку"}
                           </Button>
                           {sendResult && (
                             <div className="mt-2 text-sm">
                               {sendResult.ok ? (
                                 <span className="text-green-600">Заявка отправлена{sendResult.forwarded ? " и доставлена в группу" : ", но Telegram не настроен"}</span>
                               ) : (
                                 <span className="text-red-600">Ошибка: {sendResult.error || "проверьте сервер"}</span>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   ) : null}
                 </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="h-12 w-64 sm:h-12 sm:w-72 text-xl font-bold rounded-full mx-auto">Стать Хелпером</Button>
            </DialogTrigger>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] h-auto max-h-[90vh] sm:max-h-[560px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-hidden">
              <DialogClose asChild>
                <button aria-label="Закрыть" className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
              <div className="mt-5 sm:mt-6 grid grid-rows-[auto,1fr] h-full">
                <div className="mx-auto w-[90%] sm:w-[85%] max-w-[420px] text-center">
                  <div className="text-base sm:text-lg font-bold text-foreground">Стать Хелпером</div>
                </div>
                <div className="mt-3 sm:mt-4 overflow-y-auto min-h-0 pr-1 pb-3 sm:pb-4">
                  <div className="rounded-xl border border-border bg-white/70 dark:bg-white/10 backdrop-blur p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Имя</label>
                        <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Фамилия</label>
                        <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Курс</label>
                        <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Специализация</label>
                        <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Основные предметы</label>
                        <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Аватар</label>
                        <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
                        <button type="button" onClick={() => avatarRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition">
                          <ImageIcon className="w-4 h-4" /> Фото
                        </button>
                        {avatarFile && <div className="mt-1 text-xs text-foreground/70">Прикреплено: {avatarFile.name}</div>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Фото зачётки</label>
                        <input ref={gradeRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => setGradebookFiles(Array.from(e.target.files ?? []))} />
                        <button type="button" onClick={() => gradeRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition">
                          <ImageIcon className="w-4 h-4" /> Фото
                        </button>
                        {gradebookFiles.length > 0 && <div className="mt-1 text-xs text-foreground/70">Файлов: {gradebookFiles.length}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </DialogContent>
          </Dialog>

          {/* Диалог карточки хелпера с той же исходной формой и отправкой */}
          <Dialog open={helperFormOpen} onOpenChange={setHelperFormOpen}>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] h-[90vh] sm:h-[560px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-hidden">
              {/* Кнопка назад */}
              <button
                aria-label="Назад"
                className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition"
                onClick={() => { setHelperFormOpen(false); setSelectedHelper(null); setActiveTab("Выбрать Хелпера"); }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Назад</span>
              </button>
              <div className="mt-5 sm:mt-6 grid grid-rows-[auto,1fr] h-full">
                <div className="h-full overflow-y-auto min-h-0 pr-1 pb-3 sm:pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="mx-auto w-[90%] sm:w-[85%] max-w-[420px] mt-3 sm:mt-4">
                    {selectedHelper && (
                      <div className="text-center text-lg sm:text-xl font-semibold leading-tight">{selectedHelper.name}</div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <div className="rounded-xl border border-border bg-white/70 dark:bg-white/10 backdrop-blur p-3 sm:p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Курс</label>
                          <input value={course} onChange={(e)=>setCourse(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Направление</label>
                          <input value={direction} onChange={(e)=>setDirection(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Предмет</label>
                          <input value={subject} onChange={(e)=>setSubject(e.target.value)} type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Услуга</label>
                          <select value={service} onChange={(e)=>setService(e.target.value)} className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm">
                            <option>Решение ДЗ</option>
                            <option>Контрольная</option>
                            <option>Консультация</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-foreground/80">Условие</label>
                          <div className="flex items-center gap-2">
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)}
                            />
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                            >
                              <ImageIcon className="w-4 h-4" /> Фото
                            </button>
                          </div>
                        </div>
                        <textarea rows={3}
                          value={condition}
                          onChange={(e)=>setCondition(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                        />
                        {attachedFile && (
                          <div className="mt-1 text-xs text-foreground/70">Прикреплено: {attachedFile.name}</div>
                        )}
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <label className="block text-xs font-semibold text-foreground/80">Сумма</label>
                        <div className="relative">
                          <input value={amount} onChange={(e)=>setAmount(e.target.value)} type="text" inputMode="decimal"
                            className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 pr-10 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 text-sm">₽</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <Button
                          onClick={submitQuickForm}
                          disabled={sending}
                          variant="outline"
                          size="lg"
                          className="h-10 w-full sm:w-auto px-4 font-bold"
                        >
                          {sending ? "Отправка..." : "Оформить заявку"}
                        </Button>
                        {sendResult && (
                          <div className="mt-2 text-sm">
                            {sendResult.ok ? (
                              <span className="text-green-600">Заявка отправлена{sendResult.forwarded ? " и доставлена в группу" : ", но Telegram не настроен"}</span>
                            ) : (
                              <span className="text-red-600">Ошибка: {sendResult.error || "проверьте сервер"}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Маленькая кнопка в правом нижнем углу */}
      <div className="absolute bottom-4 right-4 hidden sm:block">
        <Button variant="outline" size="sm" className="font-bold">Срочное решение!</Button>
      </div>
    </div>
  );
}