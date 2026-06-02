import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SKINS, formatPrice, RARITY_COLORS, type Skin } from '@/data/skins';

type UpgradeState = 'idle' | 'spinning' | 'won' | 'lost';

const CHANCES = [
  { label: '×2', multiplier: 2, chance: 50 },
  { label: '×3', multiplier: 3, chance: 33 },
  { label: '×5', multiplier: 5, chance: 20 },
  { label: '×10', multiplier: 10, chance: 10 },
];

export default function Upgrade() {
  const [selectedSource, setSelectedSource] = useState<Skin | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Skin | null>(null);
  const [upgradeState, setUpgradeState] = useState<UpgradeState>('idle');
  const [spinDeg, setSpinDeg] = useState(0);
  const [chanceMode, setChanceMode] = useState(0);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [bettingActive, setBettingActive] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [bets, setBets] = useState<{ user: string; amount: number; side: 'win' | 'lose' }[]>([
    { user: 'NightOwl_CS', amount: 1200, side: 'win' },
    { user: 'Reactor_33', amount: 800, side: 'lose' },
    { user: 'ShadowFox', amount: 2500, side: 'win' },
  ]);
  const spinRef = useRef<NodeJS.Timeout | null>(null);

  const chance = selectedSource && selectedTarget
    ? Math.min(95, Math.max(5, Math.round((selectedSource.price / selectedTarget.price) * 100)))
    : CHANCES[chanceMode].chance;

  const handleUpgrade = () => {
    if (!selectedSource || upgradeState === 'spinning') return;
    setUpgradeState('spinning');

    const totalSpins = 1440 + Math.random() * 720;
    const won = Math.random() * 100 < chance;

    let start: number | null = null;
    const duration = 3000;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setSpinDeg(totalSpins * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setUpgradeState(won ? 'won' : 'lost');
        setTimeout(() => setUpgradeState('idle'), 3500);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleBet = (side: 'win' | 'lose') => {
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) return;
    setBets(prev => [{ user: 'Вы', amount, side }, ...prev]);
    setBetAmount('');
  };

  const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const chanceAngle = (chance / 100) * 360;

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-rajdhani font-bold text-3xl text-white mb-1">Апгрейд скина</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Поставь свой скин — получи скин дороже
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Source skin */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Ставка (твой скин)
            </div>
            <div
              className="skin-card p-4 cursor-pointer min-h-[200px] flex flex-col items-center justify-center transition-all hover:border-[rgba(255,140,0,0.3)]"
              onClick={() => setShowSourcePicker(true)}
            >
              {selectedSource ? (
                <>
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
                    style={{ background: `${RARITY_COLORS[selectedSource.rarity]}15` }}
                  >
                    {selectedSource.image}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full mb-1 rarity-tag-${selectedSource.rarity}`}>
                    {selectedSource.wear}
                  </div>
                  <div className="font-rajdhani font-bold text-white text-center">{selectedSource.weapon}</div>
                  <div className="text-xs text-center mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedSource.name}</div>
                  <div className="font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>
                    {formatPrice(selectedSource.price)}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,140,0,0.06)', border: '2px dashed rgba(255,140,0,0.2)' }}>
                    <Icon name="Plus" size={24} style={{ color: 'rgba(255,140,0,0.5)' }} />
                  </div>
                  <div className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Выбрать скин для ставки</div>
                </>
              )}
            </div>
          </div>

          {/* Center: Spinner */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Шанс победы
            </div>

            {/* Upgrade arc wheel */}
            <div className="relative w-56 h-56 mb-4">
              <svg width="224" height="224" viewBox="0 0 224 224" className="absolute inset-0">
                {/* Background ring */}
                <circle cx="112" cy="112" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />
                {/* Lose arc */}
                <path
                  d={arcPath(112, 112, 90, 0, 360)}
                  fill="none"
                  stroke="rgba(255,59,59,0.3)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Win arc */}
                {chance > 0 && (
                  <path
                    d={arcPath(112, 112, 90, 0, chanceAngle)}
                    fill="none"
                    stroke="#00FF88"
                    strokeWidth="18"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.6))' }}
                  />
                )}
                {/* Outer ring */}
                <circle cx="112" cy="112" r="102" fill="none" stroke="rgba(255,140,0,0.08)" strokeWidth="1" />
              </svg>

              {/* Spinning pointer */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${spinDeg}deg)`, transition: upgradeState === 'spinning' ? 'none' : 'transform 0.3s ease' }}
              >
                <div
                  className="absolute top-2 w-1 h-8 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #FF8C00, transparent)', left: '50%', transform: 'translateX(-50%)' }}
                />
              </div>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {upgradeState === 'spinning' ? (
                  <div className="text-center">
                    <div className="font-rajdhani font-bold text-3xl text-white animate-pulse">...</div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Крутим</div>
                  </div>
                ) : upgradeState === 'won' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="font-rajdhani font-bold text-lg" style={{ color: '#00FF88' }}>ПОБЕДА!</div>
                  </div>
                ) : upgradeState === 'lost' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-3xl mb-1">💔</div>
                    <div className="font-rajdhani font-bold text-lg" style={{ color: '#FF3B3B' }}>ПРОИГРЫШ</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="font-rajdhani font-bold text-4xl" style={{ color: chance >= 50 ? '#00FF88' : chance >= 25 ? '#FF8C00' : '#FF3B3B' }}>
                      {chance}%
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>шанс победы</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick chance buttons */}
            {!selectedSource && !selectedTarget && (
              <div className="flex gap-2 mb-4">
                {CHANCES.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setChanceMode(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-rajdhani font-bold transition-all ${
                      chanceMode === i ? 'text-[#070C18]' : 'text-white'
                    }`}
                    style={chanceMode === i
                      ? { background: '#FF8C00' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Upgrade button */}
            <button
              onClick={handleUpgrade}
              disabled={!selectedSource || upgradeState === 'spinning'}
              className="btn-glow w-full py-4 rounded-xl text-lg font-rajdhani font-bold flex items-center justify-center gap-2 glow-orange disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {upgradeState === 'spinning' ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Апгрейд...
                </>
              ) : (
                <>
                  <Icon name="Zap" size={20} />
                  АПГРЕЙД
                </>
              )}
            </button>

            {selectedSource && selectedTarget && (
              <div className="mt-3 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {formatPrice(selectedSource.price)} → {formatPrice(selectedTarget.price)}
              </div>
            )}
          </div>

          {/* Right: Target skin */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Цель (желаемый скин)
            </div>
            <div
              className="skin-card p-4 cursor-pointer min-h-[200px] flex flex-col items-center justify-center transition-all hover:border-[rgba(255,140,0,0.3)]"
              onClick={() => setShowTargetPicker(true)}
            >
              {selectedTarget ? (
                <>
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
                    style={{ background: `${RARITY_COLORS[selectedTarget.rarity]}15` }}
                  >
                    {selectedTarget.image}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full mb-1 rarity-tag-${selectedTarget.rarity}`}>
                    {selectedTarget.wear}
                  </div>
                  <div className="font-rajdhani font-bold text-white text-center">{selectedTarget.weapon}</div>
                  <div className="text-xs text-center mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedTarget.name}</div>
                  <div className="font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>
                    {formatPrice(selectedTarget.price)}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,140,0,0.06)', border: '2px dashed rgba(255,140,0,0.2)' }}>
                    <Icon name="Target" size={24} style={{ color: 'rgba(255,140,0,0.5)' }} />
                  </div>
                  <div className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Выбрать цель апгрейда</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Betting section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-rajdhani font-bold text-xl text-white">Ставки зрителей</h2>
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,200,255,0.1)', color: '#00C8FF', border: '1px solid rgba(0,200,255,0.2)' }}
              >
                {bets.length} ставок
              </div>
            </div>
            <button
              onClick={() => setBettingActive(!bettingActive)}
              className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
              style={bettingActive
                ? { background: 'rgba(255,140,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,140,0,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <Icon name="TrendingUp" size={14} />
              {bettingActive ? 'Закрыть' : 'Сделать ставку'}
            </button>
          </div>

          {bettingActive && (
            <div className="skin-card p-4 mb-4 animate-fade-in-up">
              <div className="text-sm font-medium mb-3 text-white">Сделай ставку на исход апгрейда</div>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Сумма ставки (₽)"
                  value={betAmount}
                  onChange={e => setBetAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                />
                <button
                  onClick={() => handleBet('win')}
                  className="px-4 py-2 rounded-lg text-sm font-rajdhani font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,255,136,0.15)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)' }}
                >
                  На победу
                </button>
                <button
                  onClick={() => handleBet('lose')}
                  className="px-4 py-2 rounded-lg text-sm font-rajdhani font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(255,59,59,0.15)', color: '#FF3B3B', border: '1px solid rgba(255,59,59,0.3)' }}
                >
                  На проигрыш
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {bets.map((bet, i) => (
              <div key={i} className="skin-card px-3 py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{bet.user}</div>
                  <div className="text-xs font-rajdhani font-bold" style={{ color: '#FF8C00' }}>
                    {formatPrice(bet.amount)}
                  </div>
                </div>
                <div
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: bet.side === 'win' ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)',
                    color: bet.side === 'win' ? '#00FF88' : '#FF3B3B',
                  }}
                >
                  {bet.side === 'win' ? '▲ Победа' : '▼ Проигрыш'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skin picker modals */}
      {(showSourcePicker || showTargetPicker) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(7,12,24,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => { setShowSourcePicker(false); setShowTargetPicker(false); }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{ background: 'var(--bg-card2)', border: '1px solid rgba(255,140,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-rajdhani font-bold text-xl text-white">
                {showSourcePicker ? 'Выбери скин для ставки' : 'Выбери целевой скин'}
              </h3>
              <button onClick={() => { setShowSourcePicker(false); setShowTargetPicker(false); }}>
                <Icon name="X" size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
              {MOCK_SKINS.map(skin => (
                <div
                  key={skin.id}
                  className={`skin-card rarity-${skin.rarity} p-3 cursor-pointer`}
                  onClick={() => {
                    if (showSourcePicker) setSelectedSource(skin);
                    else setSelectedTarget(skin);
                    setShowSourcePicker(false);
                    setShowTargetPicker(false);
                  }}
                >
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl mb-2"
                    style={{ background: `${RARITY_COLORS[skin.rarity]}12` }}
                  >
                    {skin.image}
                  </div>
                  <div className="font-rajdhani font-bold text-xs text-white">{skin.weapon}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{skin.name}</div>
                  <div className="font-rajdhani font-bold text-xs mt-1" style={{ color: '#FF8C00' }}>
                    {formatPrice(skin.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
