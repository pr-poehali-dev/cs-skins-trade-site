import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatPrice, RARITY_COLORS, type Rarity } from '@/data/skins';

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  fromSkin: string;
  fromWeapon: string;
  fromPrice: number;
  fromRarity: Rarity;
  toSkin: string;
  toWeapon: string;
  toPrice: number;
  toRarity: Rarity;
  chance: number;
  result: 'won' | 'lost';
  emoji: string;
}

const HISTORY: HistoryItem[] = [
  { id: '1', date: '02.06.2026', time: '14:32', fromSkin: 'Asiimov', fromWeapon: 'AWP', fromPrice: 4200, fromRarity: 'covert', toSkin: 'Dragon Lore', toWeapon: 'AWP', toPrice: 95000, toRarity: 'covert', chance: 4, result: 'lost', emoji: '🎯' },
  { id: '2', date: '02.06.2026', time: '13:15', fromSkin: 'Neon Rider', fromWeapon: 'AK-47', fromPrice: 1850, fromRarity: 'classified', toSkin: 'Hyper Beast', toWeapon: 'M4A1-S', toPrice: 3100, toRarity: 'covert', chance: 60, result: 'won', emoji: '🔫' },
  { id: '3', date: '01.06.2026', time: '22:47', fromSkin: 'Case Hardened', fromWeapon: 'AK-47', fromPrice: 1200, fromRarity: 'restricted', toSkin: 'Vulcan', toWeapon: 'AK-47', toPrice: 6700, toRarity: 'covert', chance: 18, result: 'won', emoji: '🔫' },
  { id: '4', date: '01.06.2026', time: '21:03', fromSkin: 'Printstream', fromWeapon: 'Glock-18', fromPrice: 890, fromRarity: 'classified', toSkin: 'Neo-Noir', toWeapon: 'AWP', toPrice: 2800, toRarity: 'classified', chance: 32, result: 'lost', emoji: '🔫' },
  { id: '5', date: '01.06.2026', time: '18:22', fromSkin: 'Icarus Fell', fromWeapon: 'Flip Knife', fromPrice: 2400, fromRarity: 'restricted', toSkin: 'Doppler', toWeapon: 'Karambit', toPrice: 22000, toRarity: 'gold', chance: 11, result: 'lost', emoji: '🔪' },
  { id: '6', date: '31.05.2026', time: '20:10', fromSkin: 'Hyper Beast', fromWeapon: 'M4A1-S', fromPrice: 3100, fromRarity: 'covert', toSkin: 'Fade', toWeapon: 'M9 Bayonet', toPrice: 18500, toRarity: 'gold', chance: 17, result: 'won', emoji: '🔪' },
  { id: '7', date: '31.05.2026', time: '15:55', fromSkin: 'Neo-Noir', fromWeapon: 'AWP', fromPrice: 2800, fromRarity: 'classified', toSkin: 'Neon Rider', toWeapon: 'AK-47', toPrice: 1850, toRarity: 'classified', chance: 95, result: 'won', emoji: '🎯' },
  { id: '8', date: '30.05.2026', time: '11:30', fromSkin: 'Printstream', fromWeapon: 'Glock-18', fromPrice: 890, fromRarity: 'classified', toSkin: 'Asiimov', toWeapon: 'AWP', toPrice: 4200, toRarity: 'covert', chance: 21, result: 'lost', emoji: '🎯' },
];

export default function History() {
  const [filter, setFilter] = useState<'all' | 'won' | 'lost'>('all');

  const filtered = HISTORY.filter(h => filter === 'all' || h.result === filter);
  const wins = HISTORY.filter(h => h.result === 'won').length;
  const losses = HISTORY.filter(h => h.result === 'lost').length;
  const totalProfit = HISTORY.reduce((sum, h) => {
    return sum + (h.result === 'won' ? h.toPrice - h.fromPrice : -h.fromPrice);
  }, 0);

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-rajdhani font-bold text-3xl text-white mb-1">История апгрейдов</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Все твои апгрейды за последние 30 дней</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Всего апгрейдов', value: HISTORY.length, color: '#FF8C00', icon: 'Zap' },
            { label: 'Победы', value: wins, color: '#00FF88', icon: 'TrendingUp' },
            { label: 'Поражения', value: losses, color: '#FF3B3B', icon: 'TrendingDown' },
            { label: 'Баланс', value: (totalProfit >= 0 ? '+' : '') + formatPrice(totalProfit), color: totalProfit >= 0 ? '#00FF88' : '#FF3B3B', icon: 'DollarSign' },
          ].map((s, i) => (
            <div key={i} className="skin-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name={s.icon} size={16} style={{ color: s.color }} />
                <div className="font-rajdhani font-bold text-xl" style={{ color: s.color }}>{s.value}</div>
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Win rate bar */}
        <div className="skin-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Винрейт</span>
            <span className="font-rajdhani font-bold" style={{ color: '#00FF88' }}>
              {Math.round((wins / HISTORY.length) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,59,59,0.3)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(wins / HISTORY.length) * 100}%`, background: 'linear-gradient(90deg, #00FF88, #00C8FF)' }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>{wins} побед</span>
            <span>{losses} поражений</span>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(['all', 'won', 'lost'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={filter === f
                ? { background: '#FF8C00', color: '#070C18', fontFamily: 'Rajdhani', fontWeight: 700 }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {f === 'all' ? 'Все' : f === 'won' ? '✓ Победы' : '✗ Поражения'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="skin-card px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s`, opacity: 1 }}
            >
              {/* Result badge */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={item.result === 'won'
                  ? { background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)' }
                  : { background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.25)' }
                }
              >
                {item.result === 'won' ? '✓' : '✗'}
              </div>

              {/* From skin */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${RARITY_COLORS[item.fromRarity]}15` }}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-rajdhani font-bold text-sm text-white truncate">{item.fromWeapon} | {item.fromSkin}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatPrice(item.fromPrice)}</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Icon name="ArrowRight" size={18} style={{ color: 'rgba(255,140,0,0.6)' }} />
                <div
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(255,140,0,0.1)', color: '#FF8C00' }}
                >
                  {item.chance}%
                </div>
                <Icon name="ArrowRight" size={18} style={{ color: 'rgba(255,140,0,0.6)' }} />
              </div>

              {/* To skin */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${RARITY_COLORS[item.toRarity]}15` }}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-rajdhani font-bold text-sm text-white truncate">{item.toWeapon} | {item.toSkin}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatPrice(item.toPrice)}</div>
                </div>
              </div>

              {/* P&L */}
              <div className="text-right flex-shrink-0">
                <div
                  className="font-rajdhani font-bold text-sm"
                  style={{ color: item.result === 'won' ? '#00FF88' : '#FF3B3B' }}
                >
                  {item.result === 'won'
                    ? `+${formatPrice(item.toPrice - item.fromPrice)}`
                    : `-${formatPrice(item.fromPrice)}`
                  }
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.date} {item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
