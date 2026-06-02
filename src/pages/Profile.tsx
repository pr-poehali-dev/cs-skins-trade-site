import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/data/skins';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'security'>('overview');
  const [steamLinked] = useState(false);

  const STATS = [
    { label: 'Баланс', value: formatPrice(12450), color: '#FF8C00', icon: 'DollarSign' },
    { label: 'Апгрейдов', value: '32', color: '#00C8FF', icon: 'Zap' },
    { label: 'Побед', value: '18', color: '#00FF88', icon: 'TrendingUp' },
    { label: 'Рейтинг', value: '#47', color: '#8847FF', icon: 'Trophy' },
  ];

  const TRANSACTIONS = [
    { type: 'deposit', amount: 5000, date: '02.06.2026', method: 'Банковская карта' },
    { type: 'win', amount: 6700, date: '01.06.2026', method: 'Апгрейд: AK-47 Vulcan' },
    { type: 'loss', amount: -4200, date: '02.06.2026', method: 'Апгрейд: AWP Dragon Lore' },
    { type: 'withdraw', amount: -3000, date: '31.05.2026', method: 'Вывод на карту' },
    { type: 'deposit', amount: 10000, date: '30.05.2026', method: 'СБП' },
  ];

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div
          className="skin-card p-6 mb-6 relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 right-0 h-24"
            style={{ background: 'linear-gradient(135deg, rgba(255,140,0,0.1), rgba(0,200,255,0.06))' }}
          />
          <div className="relative flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,140,0,0.3), rgba(255,69,0,0.2))',
                border: '2px solid rgba(255,140,0,0.4)',
                color: '#FF8C00',
                fontFamily: 'Rajdhani',
                boxShadow: '0 0 25px rgba(255,140,0,0.2)',
              }}
            >
              ПЛ
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-rajdhani font-bold text-2xl text-white">Player_01</h1>
                <div
                  className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ background: 'rgba(255,140,0,0.15)', color: '#FF8C00', border: '1px solid rgba(255,140,0,0.3)' }}
                >
                  Профи
                </div>
              </div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Участник с мая 2026 · 32 апгрейда
              </div>

              {/* Steam connect */}
              <div className="mt-3">
                {steamLinked ? (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: 'rgba(0,255,136,0.08)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.2)' }}
                  >
                    <Icon name="Check" size={14} />
                    Steam подключён
                  </div>
                ) : (
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(0,200,255,0.08)', color: '#00C8FF', border: '1px solid rgba(0,200,255,0.25)' }}
                  >
                    <Icon name="Link" size={14} />
                    Подключить Steam
                  </button>
                )}
              </div>
            </div>

            {/* Balance widget */}
            <div
              className="hidden sm:flex flex-col items-end gap-1"
            >
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Баланс</div>
              <div className="font-rajdhani font-bold text-2xl" style={{ color: '#FF8C00' }}>
                {formatPrice(12450)}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-glow px-3 py-1.5 rounded-lg text-xs"
                >
                  Пополнить
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-[rgba(255,255,255,0.06)]"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Вывести
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATS.map((s, i) => (
            <div key={i} className="skin-card p-3 text-center">
              <Icon name={s.icon} size={18} style={{ color: s.color, margin: '0 auto 4px' }} />
              <div className="font-rajdhani font-bold text-base" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['overview', 'settings', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab
                ? { background: '#FF8C00', color: '#070C18', fontFamily: 'Rajdhani', fontWeight: 700 }
                : { color: 'rgba(255,255,255,0.5)' }
              }
            >
              {tab === 'overview' ? 'Обзор' : tab === 'settings' ? 'Настройки' : 'Безопасность'}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3 animate-fade-in-up">
            <h3 className="font-rajdhani font-bold text-lg text-white">История транзакций</h3>
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className="skin-card px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: tx.amount > 0 ? 'rgba(0,255,136,0.08)' : 'rgba(255,59,59,0.08)',
                      color: tx.amount > 0 ? '#00FF88' : '#FF3B3B',
                    }}
                  >
                    <Icon name={tx.type === 'deposit' ? 'ArrowDownLeft' : tx.type === 'win' ? 'TrendingUp' : tx.type === 'loss' ? 'TrendingDown' : 'ArrowUpRight'} size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{tx.method}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.date}</div>
                  </div>
                </div>
                <div
                  className="font-rajdhani font-bold text-sm"
                  style={{ color: tx.amount > 0 ? '#00FF88' : '#FF3B3B' }}
                >
                  {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="skin-card p-5">
              <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Основные настройки</h3>
              <div className="space-y-3">
                {[
                  { label: 'Никнейм', value: 'Player_01' },
                  { label: 'Email', value: 'player@email.com' },
                  { label: 'Trade URL (Steam)', value: '' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {field.label}
                    </label>
                    <input
                      defaultValue={field.value}
                      placeholder={field.value ? '' : 'Не указано'}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-[rgba(255,140,0,0.5)]"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  </div>
                ))}
                <button className="btn-glow w-full py-2.5 rounded-xl text-sm mt-2">
                  Сохранить изменения
                </button>
              </div>
            </div>

            <div className="skin-card p-5">
              <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Уведомления</h3>
              <div className="space-y-3">
                {[
                  { label: 'Результат апгрейда', enabled: true },
                  { label: 'Новые ставки зрителей', enabled: false },
                  { label: 'Акции и бонусы', enabled: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-white">{n.label}</span>
                    <div
                      className="w-10 h-5 rounded-full cursor-pointer relative transition-all"
                      style={{ background: n.enabled ? '#FF8C00' : 'rgba(255,255,255,0.1)' }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: n.enabled ? '22px' : '2px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Security */}
        {activeTab === 'security' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="skin-card p-5">
              <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Смена пароля</h3>
              <div className="space-y-3">
                {['Текущий пароль', 'Новый пароль', 'Подтверди пароль'].map((label, i) => (
                  <div key={i}>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {label}
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  </div>
                ))}
                <button className="btn-glow w-full py-2.5 rounded-xl text-sm mt-1">
                  Изменить пароль
                </button>
              </div>
            </div>

            <div className="skin-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-rajdhani font-bold text-base text-white">Двухфакторная аутентификация</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Защити аккаунт через Google Authenticator</div>
                </div>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.25)' }}
                >
                  Включить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
