import { useState } from 'react';
import Icon from '@/components/ui/icon';

const FAQ = [
  { q: 'Как работает апгрейд скинов?', a: 'Ты выбираешь скин из инвентаря (ставка) и желаемый скин (цель). Система рассчитывает шанс победы на основе разницы цен. При победе ты получаешь целевой скин, при проигрыше — теряешь скин-ставку.' },
  { q: 'Как подключить Steam инвентарь?', a: 'Перейди в раздел "Профиль" и нажми "Подключить Steam". Авторизуйся через Steam OpenID. Твой инвентарь синхронизируется автоматически. Обязательно укажи Trade URL в настройках.' },
  { q: 'Как пополнить баланс?', a: 'Поддерживаем банковские карты (Visa/МИР), СБП, а также депозит скинами CS2. Минимальное пополнение — 100 ₽. Зачисление происходит мгновенно.' },
  { q: 'Как вывести выигрыш?', a: 'Вывод доступен на банковскую карту или обменом на скины CS2. Минимальная сумма вывода — 500 ₽. Время обработки: до 24 часов.' },
  { q: 'Как работает система ставок зрителей?', a: 'Во время апгрейда другие игроки могут делать денежные ставки на победу или поражение. При правильном прогнозе они получают выплату с коэффициентом.' },
  { q: 'Что такое Trade URL и где его найти?', a: 'Trade URL — ссылка для трейда в Steam. Найди её в настройках Steam → Инвентарь → Обмен предметами → Моя ссылка на обмен.' },
];

const TICKETS = [
  { id: '#4821', subject: 'Не дошёл скин после победы', status: 'open', date: '02.06.2026', priority: 'high' },
  { id: '#4756', subject: 'Вопрос по пополнению баланса', status: 'closed', date: '28.05.2026', priority: 'low' },
];

const STATUS_COLORS: Record<string, string> = {
  open: '#FF8C00',
  closed: '#00FF88',
  pending: '#00C8FF',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Открыт',
  closed: 'Закрыт',
  pending: 'В работе',
};

export default function Support() {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact'>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: '', message: '', category: 'general' });

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <Icon name="MessageCircle" size={28} style={{ color: '#FF8C00' }} />
          <h1 className="font-rajdhani font-bold text-3xl text-white">Поддержка</h1>
        </div>
        <p className="text-sm mb-6 ml-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Среднее время ответа: 2 часа
        </p>

        {/* Quick contacts */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Telegram', icon: 'Send', color: '#00C8FF', desc: '@skinrush_support' },
            { label: 'Email', icon: 'Mail', color: '#8847FF', desc: 'support@skinrush.gg' },
            { label: 'Онлайн чат', icon: 'MessageSquare', color: '#00FF88', desc: '09:00–03:00 МСК' },
          ].map((c, i) => (
            <div key={i} className="skin-card p-4 text-center cursor-pointer transition-all hover:scale-105">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${c.color}18` }}
              >
                <Icon name={c.icon} size={20} style={{ color: c.color }} />
              </div>
              <div className="font-rajdhani font-bold text-sm text-white">{c.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {([
            { id: 'faq', label: 'FAQ' },
            { id: 'tickets', label: 'Мои тикеты' },
            { id: 'contact', label: 'Написать' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab.id
                ? { background: '#FF8C00', color: '#070C18', fontFamily: 'Rajdhani', fontWeight: 700 }
                : { color: 'rgba(255,255,255,0.5)' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2 animate-fade-in-up">
            {FAQ.map((item, i) => (
              <div key={i} className="skin-card overflow-hidden">
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-white pr-4">{item.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={18}
                    style={{
                      color: 'rgba(255,140,0,0.7)',
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div
                    className="px-5 pb-4 text-sm animate-fade-in-up"
                    style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tickets */}
        {activeTab === 'tickets' && (
          <div className="animate-fade-in-up">
            <div className="space-y-3 mb-4">
              {TICKETS.map(ticket => (
                <div key={ticket.id} className="skin-card px-4 py-3 flex items-center gap-4 cursor-pointer">
                  <div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF8C00' }}>
                      {ticket.id}
                    </div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{ticket.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{ticket.subject}</div>
                  </div>
                  <div
                    className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
                    style={{ background: `${STATUS_COLORS[ticket.status]}15`, color: STATUS_COLORS[ticket.status] }}
                  >
                    {STATUS_LABELS[ticket.status]}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('contact')}
              className="btn-glow w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={16} />
              Создать новый тикет
            </button>
          </div>
        )}

        {/* Contact form */}
        {activeTab === 'contact' && (
          <div className="skin-card p-5 animate-fade-in-up">
            <h3 className="font-rajdhani font-bold text-xl text-white mb-4">Новое обращение</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Категория
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="general">Общий вопрос</option>
                  <option value="trade">Проблема с трейдом</option>
                  <option value="payment">Оплата и вывод</option>
                  <option value="account">Аккаунт и безопасность</option>
                  <option value="bug">Ошибка на сайте</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Тема обращения
                </label>
                <input
                  type="text"
                  placeholder="Кратко опиши проблему"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Описание
                </label>
                <textarea
                  placeholder="Подробно опиши ситуацию..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <button
                className="btn-glow w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                onClick={() => alert('Тикет отправлен!')}
              >
                <Icon name="Send" size={16} />
                Отправить обращение
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
