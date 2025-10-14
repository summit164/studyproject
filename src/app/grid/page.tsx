"use client";
import { BGPattern } from "@/components/ui/bg-pattern";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { User, Zap, X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";

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
  return (
    <div className="relative flex min-h-[70vh] sm:aspect-video flex-col items-center justify-center rounded-2xl border-2 p-4 sm:p-8">
      <BGPattern variant="grid" mask="fade-edges" />
      {/* Заголовок выше центра */}
      <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2">
        <TextShimmer
          duration={1.2}
          className="text-3xl sm:text-5xl font-bold [--base-color:#000] [--base-gradient-color:#000]"
        >
          StudyFlow
        </TextShimmer>
      </div>
      {/* Две кнопки по центру вертикально */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-72 sm:w-80">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="h-11 w-56 sm:w-64 text-lg font-bold rounded-full mx-auto">Нужна помощь</Button>
            </DialogTrigger>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] min-h-[360px] sm:min-h-[420px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-visible">
              {/* Кнопка закрытия */}
              <DialogClose asChild>
                <button aria-label="Закрыть" className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
              {/* Закрепляем переключалку: верхняя строка сетки, контент — ниже */}
              <div className="mt-4 grid grid-rows-[auto,1fr] h-[320px] sm:h-[380px]">
                <NavBar
                  position="relative"
                  className="w-[90%] sm:w-[85%] max-w-[380px] sm:max-w-[420px] mx-auto"
                  items={[
                    { name: "Выбрать Хелпера", url: "#", icon: User },
                    { name: "Быстрая заявка", url: "#", icon: Zap },
                  ]}
                  onChange={(name) => setActiveTab(name)}
                />
                <div className="mt-3 sm:mt-4 overflow-y-auto flex flex-col">
                  {activeTab === "Выбрать Хелпера" && (
                    <div className="space-y-3">
                      {helpers.map((h) => (
                        <div
                          key={h.name}
                          className="flex items-center justify-between flex-nowrap gap-3 sm:gap-4 rounded-xl border border-border bg-white/50 dark:bg-white/10 backdrop-blur p-3 cursor-pointer hover:bg-white/70 dark:hover:bg-white/15 transition"
                          role="button"
                          onClick={() => {
                            setSelectedHelper(h)
                            setHelperFormOpen(true)
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
                  )}
                  {activeTab === "Быстрая заявка" && (
                    <div className="mt-auto">
                      <div className="rounded-xl border border-border bg-white/70 dark:bg-white/10 backdrop-blur p-3 sm:p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground/80 mb-1">Курс</label>
                            <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground/80 mb-1">Направление</label>
                            <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground/80 mb-1">Предмет</label>
                            <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground/80 mb-1">Услуга</label>
                            <select className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm">
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
                            className="mt-1 w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                          />
                          {attachedFile && (
                            <div className="mt-1 text-xs text-foreground/70">Прикреплено: {attachedFile.name}</div>
                          )}
                        </div>
                        <div className="mt-3 sm:mt-4">
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Сумма</label>
                          <div className="relative">
                            <input type="text" inputMode="decimal"
                              className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 pr-10 text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 text-sm">₽</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </DialogContent>
          </Dialog>
          {/* Диалог, открывающийся при клике на карточку хелпера, с той же формой */}
          <Dialog open={helperFormOpen} onOpenChange={setHelperFormOpen}>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] min-h-[360px] sm:min-h-[420px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-visible">
              {/* Кнопка назад слева сверху */}
              <button
                aria-label="Назад"
                className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition"
                onClick={() => { setHelperFormOpen(false); setSelectedHelper(null); setActiveTab("Выбрать Хелпера"); }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Назад</span>
              </button>
              {/* Кнопка закрытия */}
              <DialogClose asChild>
                <button aria-label="Закрыть" className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
              {/* Заголовок */}
              {selectedHelper && (
                <div className="mx-auto w-[90%] sm:w-[85%] max-w-[420px] text-center">
                  <div className="text-base sm:text-lg font-bold text-foreground">{selectedHelper.name}</div>
                </div>
              )}
              {/* Форма */}
              <div className="mt-4">
                <div className="rounded-xl border border-border bg-white/70 dark:bg-white/10 backdrop-blur p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Курс</label>
                      <input type="text" placeholder="Напр. 1 курс" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Направление</label>
                      <input type="text" placeholder="ФИТ, Экономика..." className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Предмет</label>
                      <input type="text" placeholder="Алгебра, Python..." className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Услуга</label>
                      <select className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm">
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
                    <textarea rows={3} placeholder="Опишите условия задачи"
                      className="mt-1 w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                    />
                    {attachedFile && (
                      <div className="mt-1 text-xs text-foreground/70">Прикреплено: {attachedFile.name}</div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">Сумма</label>
                    <div className="relative">
                      <input type="text" inputMode="decimal" placeholder="Напр. 1500"
                        className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 pr-10 text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 text-sm">₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Диалог анкеты для кнопки "Стать Хелпером" */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="h-11 w-56 sm:w-64 text-lg font-bold rounded-full mx-auto">Стать Хелпером</Button>
            </DialogTrigger>
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[560px] min-h-[360px] sm:min-h-[420px] pt-3 sm:pt-4 pb-5 sm:pb-6 border-none overflow-visible">
              {/* Кнопка закрытия */}
              <DialogClose asChild>
                <button aria-label="Закрыть" className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
              {/* Форма анкеты хелпера */}
              <div className="mt-5 sm:mt-6">
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
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Направление</label>
                      <input type="text" className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">Основные предметы (в чём хорош)</label>
                    <textarea rows={3}
                      className="w-full rounded-lg border border-border bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Фото аватара (необязательно)</label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={avatarRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                        />
                        <button
                          type="button"
                          onClick={() => avatarRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                        >
                          <ImageIcon className="w-4 h-4" /> Фото
                        </button>
                      </div>
                      {avatarFile && (
                        <div className="mt-2">
                          <img src={URL.createObjectURL(avatarFile)} alt="Аватар" className="h-12 w-12 rounded-full border border-border object-cover" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">Фото зачётки (последние две сессии)</label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={gradeRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => setGradebookFiles(Array.from(e.target.files ?? []))}
                        />
                        <button
                          type="button"
                          onClick={() => gradeRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                        >
                          <ImageIcon className="w-4 h-4" /> Фото
                        </button>
                      </div>
                      {gradebookFiles.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          {gradebookFiles.slice(0, 2).map((f, idx) => (
                            <img key={idx} src={URL.createObjectURL(f)} alt={`Зачётка ${idx + 1}`} className="h-12 w-12 rounded-md border border-border object-cover" />
                          ))}
                        </div>
                      )}
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