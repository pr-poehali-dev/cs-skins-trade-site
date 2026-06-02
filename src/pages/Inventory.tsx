import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SKINS, formatPrice, RARITY_COLORS, RARITY_LABELS, type Rarity } from '@/data/skins';

const FILTERS: { label: string; value: Rarity | 'all' }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Тайные', value: 'covert' },
  { label: 'Засекреченные', value: 'classified' },
  { label: 'Запрещённые', value: 'restricted' },
  { label: 'Военные', value: 'milspec' },
  { label: 'Редкие ★', value: 'gold' },
];

export default function Inventory() {
  const [filter, setFilter] = useState<Rarity | 'all'>('all');
  const [sort, setSort] = useState<'price-desc' | 'price-asc' | 'name'>('price-desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_SKINS
    .filter(s => filter === 'all' || s.rarity === filter)
    .sort((a, b) => {
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'price-asc') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  const totalValue = MOCK_SKINS.reduce((sum, s) => sum + s.price, 0);
  const selectedValue = MOCK_SKINS.filter(s => selected.has(s.id)).reduce((sum, s) => sum + s.price, 0);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-rajdhani font-bold text-3xl text-white">Инвентарь</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {MOCK_SKINS.length} скинов · Общая стоимость: {formatPrice(totalValue)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'rgba(0,200,255,0.1)', color: '#00C8FF', border: '1px solid rgba(0,200,255,0.2)' }}
            >
              <Icon name="RefreshCw" size={15} />
              Обновить из Steam
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Всего скинов', value: MOCK_SKINS.length, color: '#FF8C00' },
            { label: 'Общая стоимость', value: formatPrice(totalValue), color: '#00FF88' },
            { label: 'Выбрано', value: selected.size > 0 ? formatPrice(selectedValue) : '—', color: '#00C8FF' },
          ].map((s, i) => (
            <div key={i} className="skin-card p-4">
              <div className="font-rajdhani font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={filter === f.value
                  ? { background: '#FF8C00', color: '#070C18', fontFamily: 'Rajdhani', fontWeight: 700 }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              <option value="price-desc">Дороже сначала</option>
              <option value="price-asc">Дешевле сначала</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        {/* Selected actions bar */}
        {selected.size > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 animate-fade-in-up"
            style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}
          >
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Выбрано: <span className="font-bold text-white">{selected.size}</span> скина на{' '}
              <span className="font-bold" style={{ color: '#FF8C00' }}>{formatPrice(selectedValue)}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="btn-glow px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
              >
                <Icon name="Zap" size={14} />
                Апгрейд
              </button>
              <button
                className="px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => setSelected(new Set())}
              >
                <Icon name="X" size={14} />
                Снять выбор
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(skin => (
            <div
              key={skin.id}
              className={`skin-card rarity-${skin.rarity} p-3 cursor-pointer relative`}
              onClick={() => toggleSelect(skin.id)}
              style={selected.has(skin.id) ? { borderColor: '#FF8C00', background: 'rgba(255,140,0,0.06)' } : {}}
            >
              {/* Select checkmark */}
              <div
                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                style={selected.has(skin.id)
                  ? { background: '#FF8C00' }
                  : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }
                }
              >
                {selected.has(skin.id) && (
                  <Icon name="Check" size={12} style={{ color: '#070C18' }} />
                )}
              </div>

              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center text-4xl mb-3"
                style={{ background: `${RARITY_COLORS[skin.rarity]}12` }}
              >
                {skin.image}
              </div>

              <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mb-1.5 rarity-tag-${skin.rarity}`}>
                {RARITY_LABELS[skin.rarity]}
              </div>

              <div className="font-rajdhani font-bold text-sm text-white leading-tight">{skin.weapon}</div>
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{skin.name}</div>
              <div className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Float: {skin.float}</div>

              <div className="flex items-center justify-between">
                <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF8C00' }}>
                  {formatPrice(skin.price)}
                </div>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{skin.wear}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
