import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SKINS, formatPrice, RARITY_COLORS, type Skin } from '@/data/skins';

// ── Web Audio helpers ──────────────────────────────────────────────────────────
const getAudioCtx = () =>
  new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

const playWinSound = () => {
  try {
    const ctx = getAudioCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.45);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.45);
    });
    const sh = ctx.createOscillator();
    const sg = ctx.createGain();
    sh.connect(sg); sg.connect(ctx.destination);
    sh.type = 'triangle'; sh.frequency.value = 2093;
    sg.gain.setValueAtTime(0.08, ctx.currentTime + 0.5);
    sg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
    sh.start(ctx.currentTime + 0.5); sh.stop(ctx.currentTime + 1.1);
  } catch (_) { /* not supported */ }
};

const playLoseSound = () => {
  try {
    const ctx = getAudioCtx();
    const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
    o1.connect(g1); g1.connect(ctx.destination);
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(280, ctx.currentTime);
    o1.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.65);
    g1.gain.setValueAtTime(0.14, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.7);

    const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
    o2.connect(g2); g2.connect(ctx.destination);
    o2.type = 'sine';
    o2.frequency.setValueAtTime(75, ctx.currentTime);
    o2.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.45);
    g2.gain.setValueAtTime(0.18, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    o2.start(ctx.currentTime); o2.stop(ctx.currentTime + 0.5);
  } catch (_) { /* not supported */ }
};

const playTick = () => {
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'square'; o.frequency.value = 900;
    g.gain.setValueAtTime(0.035, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.04);
  } catch (_) { /* not supported */ }
};

// ── Types ──────────────────────────────────────────────────────────────────────
type UpgradeState = 'idle' | 'spinning' | 'won' | 'lost';

const QUICK_MODES = [
  { label: '×2',  chance: 50, multiplier: 2  },
  { label: '×3',  chance: 33, multiplier: 3  },
  { label: '×5',  chance: 20, multiplier: 5  },
  { label: '×10', chance: 10, multiplier: 10 },
];

// ── SVG arc helper ─────────────────────────────────────────────────────────────
function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcD(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const span = endDeg - startDeg;
  if (span <= 0) return '';
  if (span >= 360) {
    // full circle via two half-arcs
    const top = polarXY(cx, cy, r, startDeg);
    const bot = polarXY(cx, cy, r, startDeg + 180);
    return `M ${top.x} ${top.y} A ${r} ${r} 0 1 1 ${bot.x} ${bot.y} A ${r} ${r} 0 1 1 ${top.x} ${top.y}`;
  }
  const s = polarXY(cx, cy, r, startDeg);
  const e = polarXY(cx, cy, r, endDeg);
  const large = span > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

// ── Component ──────────────────────────────────────────────────────────────────
interface UpgradeProps {
  balance: number;
  onBalanceChange: (delta: number) => void;
}

export default function Upgrade({ balance, onBalanceChange }: UpgradeProps) {
  const [source, setSource] = useState<Skin | null>(null);
  const [target, setTarget] = useState<Skin | null>(null);
  const [state, setState] = useState<UpgradeState>('idle');
  // wheelDeg: сколько градусов повёрнуто колесо (нарастающее, не сбрасывается)
  const [wheelDeg, setWheelDeg] = useState(0);
  const [quickMode, setQuickMode] = useState(0);
  const [showPicker, setShowPicker] = useState<'source' | 'target' | null>(null);
  const [bettingOpen, setBettingOpen] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [bets, setBets] = useState([
    { user: 'NightOwl_CS', amount: 1200, side: 'win' as const },
    { user: 'Reactor_33',  amount: 800,  side: 'lose' as const },
    { user: 'ShadowFox',   amount: 2500, side: 'win' as const },
  ]);

  const rafRef       = useRef<number | null>(null);
  const tickAccRef   = useRef(0); // накопленные градусы для тика

  // ── Шанс победы ───────────────────────────────────────────────────────────
  // Если оба скина выбраны: шанс = ставка/цель*100, зажатый в [3, 95]
  // Иначе — быстрый режим
  const chance =
    source && target
      ? Math.min(95, Math.max(3, Math.round((source.price / target.price) * 100)))
      : QUICK_MODES[quickMode].chance;

  const winZoneDeg = (chance / 100) * 360; // размер зелёной дуги

  // ── Апгрейд ────────────────────────────────────────────────────────────────
  const handleUpgrade = () => {
    if (state === 'spinning') return;
    if (!source) return; // нужен хотя бы скин-ставка

    // Заранее определяем результат честно
    const won = Math.random() * 100 < chance;

    // Финальный угол колеса в системе «0° = верх = указатель»
    // Зелёная зона: [0°, winZoneDeg). Красная: [winZoneDeg, 360°).
    // Стрелка ФИКСИРОВАНА сверху, колесо крутится.
    // Если колесо повёрнуто на X° — под стрелкой окажется сектор X°.
    // Чтобы стрелка попала в зелёную зону: wheelDeg (mod 360) ∈ [0, winZoneDeg).
    // Чтобы в красную: wheelDeg (mod 360) ∈ [winZoneDeg, 360).

    const margin = Math.max(3, winZoneDeg * 0.05);
    let sectorTarget: number;
    if (won) {
      sectorTarget = margin + Math.random() * (winZoneDeg - margin * 2);
    } else {
      const redSize = 360 - winZoneDeg;
      sectorTarget = winZoneDeg + margin + Math.random() * (redSize - margin * 2);
    }

    // Добавляем 6–8 полных оборотов для зрелищности
    const extraRotations = (6 + Math.floor(Math.random() * 3)) * 360;
    const startDeg = wheelDeg; // текущий угол
    // Нормализуем текущий угол в [0,360)
    const currentSector = ((startDeg % 360) + 360) % 360;
    // Нам нужно доехать до sectorTarget
    let delta = sectorTarget - currentSector;
    if (delta < 0) delta += 360;
    const targetDeg = startDeg + extraRotations + delta;

    setState('spinning');
    tickAccRef.current = 0;

    const DURATION = 4200;
    let t0: number | null = null;

    const animate = (ts: number) => {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;
      const progress = Math.min(elapsed / DURATION, 1);
      // ease-out quart — плавное торможение
      const eased = 1 - Math.pow(1 - progress, 4);
      const deg = startDeg + (targetDeg - startDeg) * eased;

      setWheelDeg(deg);

      // тики — каждые ~15° в начале, реже к концу
      const moved = deg - startDeg;
      const tickEvery = 15 + progress * 35; // 15→50 градусов
      if (moved - tickAccRef.current >= tickEvery) {
        playTick();
        tickAccRef.current = moved;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setWheelDeg(targetDeg);
        // Изменяем баланс: победа — получаем цену цели, проигрыш — теряем цену ставки
        const stakePrice = source?.price ?? 0;
        const targetPrice = target?.price ?? stakePrice * QUICK_MODES[quickMode].multiplier;
        if (won) {
          onBalanceChange(targetPrice - stakePrice); // прибыль = цель минус ставка
        } else {
          onBalanceChange(-stakePrice); // теряем ставку
        }
        setTimeout(() => { if (won) playWinSound(); else playLoseSound(); }, 100);
        setState(won ? 'won' : 'lost');
        setTimeout(() => setState('idle'), 3500);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-rajdhani font-bold text-3xl text-white">Апгрейд скина</h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}>
            <Icon name="Wallet" size={16} style={{ color: '#FF8C00' }} />
            <span className="font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>
              {balance.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Поставь свой скин — получи скин дороже
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Скин-ставка ── */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Ставка (твой скин)
            </div>
            <div
              className="skin-card p-4 cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
              onClick={() => setShowPicker('source')}
            >
              {source ? (
                <>
                  <div className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
                    style={{ background: `${RARITY_COLORS[source.rarity]}18` }}>
                    {source.image}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full mb-1 rarity-tag-${source.rarity}`}>{source.wear}</div>
                  <div className="font-rajdhani font-bold text-white text-center">{source.weapon}</div>
                  <div className="text-xs text-center mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{source.name}</div>
                  <div className="font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>{formatPrice(source.price)}</div>
                  <button className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}
                    onClick={e => { e.stopPropagation(); setSource(null); }}>
                    Убрать
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,140,0,0.06)', border: '2px dashed rgba(255,140,0,0.25)' }}>
                    <Icon name="Plus" size={24} style={{ color: 'rgba(255,140,0,0.5)' }} />
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Выбрать скин-ставку</div>
                </>
              )}
            </div>
          </div>

          {/* ── Колесо ── */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Шанс победы
            </div>

            <div className="relative w-56 h-56 mb-5">
              {/* Фиксированная стрелка сверху */}
              <div className="absolute top-0 left-1/2 z-20" style={{ transform: 'translateX(-50%)' }}>
                <div style={{
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '18px solid #FF8C00',
                  filter: 'drop-shadow(0 0 6px rgba(255,140,0,1))',
                  marginLeft: '-7px',
                }} />
              </div>

              {/* Вращающееся колесо */}
              <div className="absolute inset-0" style={{ transform: `rotate(${wheelDeg}deg)` }}>
                <svg width="224" height="224" viewBox="0 0 224 224" style={{ overflow: 'visible' }}>
                  {/* Красная зона — всё кольцо */}
                  <path
                    d={arcD(112, 112, 88, 0, 360)}
                    fill="none" stroke="rgba(235,75,75,0.5)" strokeWidth="24"
                  />
                  {/* Зелёная зона */}
                  {winZoneDeg > 0 && (
                    <path
                      d={arcD(112, 112, 88, 0, winZoneDeg)}
                      fill="none" stroke="#00FF88" strokeWidth="24"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.8))' }}
                    />
                  )}
                  {/* Разделитель зон */}
                  {chance > 3 && chance < 97 && (
                    <line
                      x1="112" y1="0" x2="112" y2="30"
                      stroke="rgba(7,12,24,0.9)" strokeWidth="3"
                    />
                  )}
                  {/* Внешний декор */}
                  <circle cx="112" cy="112" r="102" fill="none"
                    stroke="rgba(255,140,0,0.08)" strokeWidth="1" />
                </svg>
              </div>

              {/* Центр (неподвижный) */}
              <div className="absolute rounded-full flex flex-col items-center justify-center z-10"
                style={{
                  inset: '56px',
                  background: 'radial-gradient(circle at center, #111B30, #070C18)',
                  border: '2px solid rgba(255,140,0,0.2)',
                  boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                }}>
                {state === 'spinning' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin mb-1" />
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>крутим</div>
                  </>
                ) : state === 'won' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-2xl">🏆</div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#00FF88' }}>ПОБЕДА!</div>
                  </div>
                ) : state === 'lost' ? (
                  <div className="text-center animate-win-burst">
                    <div className="text-2xl">💔</div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF3B3B' }}>ПРОИГРЫШ</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="font-rajdhani font-bold text-3xl leading-none"
                      style={{ color: chance >= 50 ? '#00FF88' : chance >= 25 ? '#FF8C00' : '#FF3B3B' }}>
                      {chance}%
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>шанс</div>
                  </div>
                )}
              </div>
            </div>

            {/* Быстрые множители (только без выбранных скинов) */}
            {(!source || !target) && (
              <div className="flex gap-2 mb-4">
                {QUICK_MODES.map((m, i) => (
                  <button key={i} onClick={() => setQuickMode(i)}
                    className="px-3 py-1.5 rounded-lg text-sm font-rajdhani font-bold transition-all"
                    style={quickMode === i
                      ? { background: '#FF8C00', color: '#070C18' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            {/* Шанс-бар */}
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: '#00FF88' }}>Победа {chance}%</span>
                <span style={{ color: '#FF3B3B' }}>Проигрыш {100 - chance}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(235,75,75,0.4)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${chance}%`, background: 'linear-gradient(90deg, #00FF88, #00C8FF)' }} />
              </div>
            </div>

            {/* Кнопка апгрейда */}
            <button
              onClick={handleUpgrade}
              disabled={!source || state === 'spinning'}
              className="btn-glow w-full py-4 rounded-xl text-lg font-rajdhani font-bold flex items-center justify-center gap-2 glow-orange disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {state === 'spinning' ? (
                <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Апгрейд...</>
              ) : (
                <><Icon name="Zap" size={20} />АПГРЕЙД</>
              )}
            </button>

            {source && target && (
              <div className="mt-2 text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {formatPrice(source.price)} → {formatPrice(target.price)}
              </div>
            )}
          </div>

          {/* ── Скин-цель ── */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Цель (желаемый скин)
            </div>
            <div
              className="skin-card p-4 cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
              onClick={() => setShowPicker('target')}
            >
              {target ? (
                <>
                  <div className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
                    style={{ background: `${RARITY_COLORS[target.rarity]}18` }}>
                    {target.image}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full mb-1 rarity-tag-${target.rarity}`}>{target.wear}</div>
                  <div className="font-rajdhani font-bold text-white text-center">{target.weapon}</div>
                  <div className="text-xs text-center mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{target.name}</div>
                  <div className="font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>{formatPrice(target.price)}</div>
                  <button className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}
                    onClick={e => { e.stopPropagation(); setTarget(null); }}>
                    Убрать
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,140,0,0.06)', border: '2px dashed rgba(255,140,0,0.25)' }}>
                    <Icon name="Target" size={24} style={{ color: 'rgba(255,140,0,0.5)' }} />
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Выбрать скин-цель</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Ставки зрителей ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-rajdhani font-bold text-xl text-white">Ставки зрителей</h2>
              <div className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,200,255,0.1)', color: '#00C8FF', border: '1px solid rgba(0,200,255,0.2)' }}>
                {bets.length} ставок
              </div>
            </div>
            <button onClick={() => setBettingOpen(v => !v)}
              className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
              style={bettingOpen
                ? { background: 'rgba(255,140,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,140,0,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Icon name="TrendingUp" size={14} />
              {bettingOpen ? 'Закрыть' : 'Сделать ставку'}
            </button>
          </div>

          {bettingOpen && (
            <div className="skin-card p-4 mb-4 animate-fade-in-up">
              <div className="text-sm font-medium mb-3 text-white">Поставь на исход апгрейда</div>
              <div className="flex gap-3">
                <input type="number" placeholder="Сумма (₽)" value={betAmount}
                  onChange={e => setBetAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }} />
                <button onClick={() => {
                    const a = parseFloat(betAmount);
                    if (a > 0) { setBets(p => [{ user: 'Вы', amount: a, side: 'win' }, ...p]); setBetAmount(''); }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-rajdhani font-bold"
                  style={{ background: 'rgba(0,255,136,0.15)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)' }}>
                  На победу
                </button>
                <button onClick={() => {
                    const a = parseFloat(betAmount);
                    if (a > 0) { setBets(p => [{ user: 'Вы', amount: a, side: 'lose' }, ...p]); setBetAmount(''); }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-rajdhani font-bold"
                  style={{ background: 'rgba(255,59,59,0.15)', color: '#FF3B3B', border: '1px solid rgba(255,59,59,0.3)' }}>
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
                  <div className="text-xs font-rajdhani font-bold" style={{ color: '#FF8C00' }}>{formatPrice(bet.amount)}</div>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: bet.side === 'win' ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)',
                    color: bet.side === 'win' ? '#00FF88' : '#FF3B3B',
                  }}>
                  {bet.side === 'win' ? '▲ Победа' : '▼ Проигрыш'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Пикер скинов ── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(7,12,24,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowPicker(null)}>
          <div className="w-full max-w-2xl rounded-2xl p-6"
            style={{ background: '#111B30', border: '1px solid rgba(255,140,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-rajdhani font-bold text-xl text-white">
                {showPicker === 'source' ? 'Выбери скин-ставку' : 'Выбери целевой скин'}
              </h3>
              <button onClick={() => setShowPicker(null)}>
                <Icon name="X" size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
              {MOCK_SKINS.map(skin => (
                <div key={skin.id}
                  className={`skin-card rarity-${skin.rarity} p-3 cursor-pointer`}
                  onClick={() => {
                    if (showPicker === 'source') setSource(skin);
                    else setTarget(skin);
                    setShowPicker(null);
                  }}>
                  <div className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl mb-2"
                    style={{ background: `${RARITY_COLORS[skin.rarity]}12` }}>
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