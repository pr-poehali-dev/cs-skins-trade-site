import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SKINS, formatPrice, RARITY_COLORS, type Skin } from '@/data/skins';

// Генерация звуков через Web Audio API
const createAudioContext = () => {
   
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
};

const playWinSound = () => {
  try {
    const ctx = createAudioContext();
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6 — победный аккорд
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(2093, ctx.currentTime + 0.48);
    shimmerGain.gain.setValueAtTime(0.1, ctx.currentTime + 0.48);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    shimmer.start(ctx.currentTime + 0.48);
    shimmer.stop(ctx.currentTime + 1.0);
  } catch (_) { /* Web Audio not supported */ }
};

const playLoseSound = () => {
  try {
    const ctx = createAudioContext();
    // Нисходящий грустный тон
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);

    // Второй слой — низкий удар
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(80, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (_) { /* Web Audio not supported */ }
};

const playSpinTickSound = () => {
  try {
    const ctx = createAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (_) { /* Web Audio not supported */ }
};

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
  const rafRef = useRef<number | null>(null);
  const lastTickDeg = useRef<number>(0);

  // Шанс = цена ставки / цена цели * 100, зажат в [5, 95]
  const chance = selectedSource && selectedTarget
    ? Math.min(95, Math.max(5, Math.round((selectedSource.price / selectedTarget.price) * 100)))
    : CHANCES[chanceMode].chance;

  const handleUpgrade = () => {
    if (!selectedSource || upgradeState === 'spinning') return;

    const roll = Math.random() * 100;
    const won = roll < chance;

    const winZoneEnd = (chance / 100) * 360;

    let finalAngle: number;
    if (won) {
      const margin = Math.min(5, winZoneEnd * 0.1);
      finalAngle = margin + Math.random() * (winZoneEnd - margin * 2);
    } else {
      const margin = 5;
      finalAngle = winZoneEnd + margin + Math.random() * (360 - winZoneEnd - margin * 2);
    }

    const fullRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetDeg = fullRotations + finalAngle;

    setUpgradeState('spinning');
    lastTickDeg.current = spinDeg;

    const duration = 4000;
    let startTime: number | null = null;
    const startDeg = spinDeg % 360;

    // Интервал тиков: быстро в начале, медленнее к концу
    const TICK_INTERVAL = 18; // градусов между тиками

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentDeg = startDeg + (targetDeg - startDeg) * eased;
      setSpinDeg(currentDeg);

      // Тик при каждом TICK_INTERVAL градусов вращения
      const degDiff = currentDeg - lastTickDeg.current;
      if (degDiff >= TICK_INTERVAL) {
        playSpinTickSound();
        lastTickDeg.current = currentDeg;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setSpinDeg(targetDeg);
        // Финальный звук с небольшой задержкой
        setTimeout(() => {
          if (won) playWinSound();
          else playLoseSound();
        }, 150);
        setUpgradeState(won ? 'won' : 'lost');
        setTimeout(() => setUpgradeState('idle'), 3500);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
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

            {/* Upgrade wheel */}
            <div className="relative w-56 h-56 mb-4">
              {/* Стрелка-указатель: ФИКСИРОВАННАЯ сверху */}
              <div
                className="absolute left-1/2 top-0 z-20"
                style={{ transform: 'translateX(-50%)', width: 0, height: 0 }}
              >
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '20px solid #FF8C00',
                  filter: 'drop-shadow(0 0 6px rgba(255,140,0,0.9))',
                  marginLeft: '-8px',
                }} />
              </div>

              {/* Вращающееся колесо */}
              <div
                className="absolute inset-0"
                style={{ transform: `rotate(${spinDeg}deg)` }}
              >
                <svg width="224" height="224" viewBox="0 0 224 224">
                  {/* Красная зона (поражение) — всё кольцо */}
                  <circle
                    cx="112" cy="112" r="90"
                    fill="none"
                    stroke="rgba(255,59,59,0.45)"
                    strokeWidth="22"
                  />
                  {/* Зелёная зона (победа) — дуга от 0 до chanceAngle */}
                  {chance > 0 && chanceAngle < 360 && (
                    <path
                      d={arcPath(112, 112, 90, 0, chanceAngle)}
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="22"
                      strokeLinecap="butt"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.7))' }}
                    />
                  )}
                  {chance >= 95 && (
                    <circle
                      cx="112" cy="112" r="90"
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="22"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.7))' }}
                    />
                  )}
                  {/* Разделительная линия */}
                  {chance > 5 && chance < 95 && (
                    <line
                      x1="112" y1="22"
                      x2="112" y2="50"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="3"
                    />
                  )}
                  {/* Внешнее кольцо */}
                  <circle cx="112" cy="112" r="104" fill="none" stroke="rgba(255,140,0,0.1)" strokeWidth="1" />
                  <circle cx="112" cy="112" r="76" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </svg>
              </div>

              {/* Центральный круг (неподвижный) */}
              <div
                className="absolute rounded-full flex flex-col items-center justify-center z-10"
                style={{
                  inset: '52px',
                  background: 'radial-gradient(circle, #0D1526, #070C18)',
                  border: '2px solid rgba(255,140,0,0.2)',
                  boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                }}
              >
                {upgradeState === 'spinning' ? (
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Крутим</div>
                  </div>
                ) : upgradeState === 'won' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-2xl mb-0.5">🏆</div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#00FF88' }}>ПОБЕДА!</div>
                  </div>
                ) : upgradeState === 'lost' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-2xl mb-0.5">💔</div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF3B3B' }}>ПРОИГРЫШ</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div
                      className="font-rajdhani font-bold text-3xl leading-none"
                      style={{ color: chance >= 50 ? '#00FF88' : chance >= 25 ? '#FF8C00' : '#FF3B3B' }}
                    >
                      {chance}%
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>шанс победы</div>
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