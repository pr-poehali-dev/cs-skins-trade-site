import Icon from '@/components/ui/icon';
import { formatPrice } from '@/data/skins';

const PLAYERS = [
  { rank: 1, name: 'GhostFire_X', avatar: '🔥', profit: 284000, upgrades: 847, winRate: 68, badge: 'Легенда' },
  { rank: 2, name: 'DarkMatter99', avatar: '⚡', profit: 198500, upgrades: 623, winRate: 71, badge: 'Мастер' },
  { rank: 3, name: 'NightOwl_CS', avatar: '🦉', profit: 156200, upgrades: 512, winRate: 64, badge: 'Мастер' },
  { rank: 4, name: 'Phantom_x7', avatar: '👻', profit: 98700, upgrades: 389, winRate: 58, badge: 'Эксперт' },
  { rank: 5, name: 'SniperElite', avatar: '🎯', profit: 87300, upgrades: 445, winRate: 55, badge: 'Эксперт' },
  { rank: 6, name: 'Reactor_33', avatar: '⚛️', profit: 74100, upgrades: 298, winRate: 62, badge: 'Профи' },
  { rank: 7, name: 'ShadowFox', avatar: '🦊', profit: 61500, upgrades: 267, winRate: 57, badge: 'Профи' },
  { rank: 8, name: 'IronWolf_22', avatar: '🐺', profit: 52800, upgrades: 201, winRate: 60, badge: 'Профи' },
  { rank: 9, name: 'CyberStrike', avatar: '💎', profit: 44200, upgrades: 178, winRate: 53, badge: 'Игрок' },
  { rank: 10, name: 'PixelKnight', avatar: '⚔️', profit: 38600, upgrades: 156, winRate: 51, badge: 'Игрок' },
];

const BADGE_COLORS: Record<string, string> = {
  'Легенда': '#E4AE39',
  'Мастер': '#D32CE6',
  'Эксперт': '#EB4B4B',
  'Профи': '#FF8C00',
  'Игрок': '#5E98D9',
};

const TOP3_COLORS = ['#E4AE39', '#C0C0C0', '#CD7F32'];
const TOP3_GLOW = ['rgba(228,174,57,0.4)', 'rgba(192,192,192,0.3)', 'rgba(205,127,50,0.3)'];

export default function Leaderboard() {
  const top3 = PLAYERS.slice(0, 3);
  const rest = PLAYERS.slice(3);

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-rajdhani font-bold text-3xl text-white mb-1">Рейтинг игроков</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Топ трейдеров по прибыли за всё время
        </p>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {/* 2nd */}
          <div className="flex flex-col items-center flex-1 max-w-[140px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
              style={{ background: `rgba(192,192,192,0.1)`, border: `2px solid ${TOP3_COLORS[1]}`, boxShadow: `0 0 20px ${TOP3_GLOW[1]}` }}
            >
              {top3[1].avatar}
            </div>
            <div className="font-rajdhani font-bold text-base text-white">{top3[1].name}</div>
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>×{top3[1].upgrades} апгрейдов</div>
            <div
              className="w-full rounded-t-xl flex flex-col items-center justify-start pt-3 pb-2"
              style={{ height: '80px', background: `linear-gradient(180deg, ${TOP3_COLORS[1]}20, ${TOP3_COLORS[1]}08)`, border: `1px solid ${TOP3_COLORS[1]}40`, borderBottom: 'none' }}
            >
              <div className="font-rajdhani font-bold text-2xl" style={{ color: TOP3_COLORS[1] }}>2</div>
              <div className="text-xs font-bold" style={{ color: TOP3_COLORS[1] }}>{formatPrice(top3[1].profit)}</div>
            </div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center flex-1 max-w-[160px] -mt-4">
            <div className="text-2xl mb-1">👑</div>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-2"
              style={{ background: `rgba(228,174,57,0.15)`, border: `2px solid ${TOP3_COLORS[0]}`, boxShadow: `0 0 30px ${TOP3_GLOW[0]}` }}
            >
              {top3[0].avatar}
            </div>
            <div className="font-rajdhani font-bold text-lg text-white">{top3[0].name}</div>
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>×{top3[0].upgrades} апгрейдов</div>
            <div
              className="w-full rounded-t-xl flex flex-col items-center justify-start pt-3 pb-2"
              style={{ height: '110px', background: `linear-gradient(180deg, ${TOP3_COLORS[0]}25, ${TOP3_COLORS[0]}08)`, border: `1px solid ${TOP3_COLORS[0]}50`, borderBottom: 'none' }}
            >
              <div className="font-rajdhani font-bold text-3xl" style={{ color: TOP3_COLORS[0] }}>1</div>
              <div className="text-sm font-bold" style={{ color: TOP3_COLORS[0] }}>{formatPrice(top3[0].profit)}</div>
            </div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center flex-1 max-w-[140px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
              style={{ background: `rgba(205,127,50,0.1)`, border: `2px solid ${TOP3_COLORS[2]}`, boxShadow: `0 0 20px ${TOP3_GLOW[2]}` }}
            >
              {top3[2].avatar}
            </div>
            <div className="font-rajdhani font-bold text-base text-white">{top3[2].name}</div>
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>×{top3[2].upgrades} апгрейдов</div>
            <div
              className="w-full rounded-t-xl flex flex-col items-center justify-start pt-3 pb-2"
              style={{ height: '60px', background: `linear-gradient(180deg, ${TOP3_COLORS[2]}20, ${TOP3_COLORS[2]}08)`, border: `1px solid ${TOP3_COLORS[2]}40`, borderBottom: 'none' }}
            >
              <div className="font-rajdhani font-bold text-2xl" style={{ color: TOP3_COLORS[2] }}>3</div>
              <div className="text-xs font-bold" style={{ color: TOP3_COLORS[2] }}>{formatPrice(top3[2].profit)}</div>
            </div>
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {rest.map((player, i) => (
            <div
              key={player.rank}
              className="skin-card px-4 py-3 flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 1 }}
            >
              <div
                className="w-8 text-center font-rajdhani font-bold text-lg flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {player.rank}
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {player.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-rajdhani font-bold text-white">{player.name}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${BADGE_COLORS[player.badge]}18`, color: BADGE_COLORS[player.badge] }}
                  >
                    {player.badge}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {player.upgrades} апгрейдов · {player.winRate}% побед
                </div>
              </div>
              <div className="text-right">
                <div className="font-rajdhani font-bold text-sm" style={{ color: '#00FF88' }}>
                  +{formatPrice(player.profit)}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <div className="h-1 rounded-full" style={{ width: `${player.winRate * 0.7}px`, background: '#00FF88', opacity: 0.6 }} />
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{player.winRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Your rank */}
        <div
          className="mt-4 px-4 py-3 rounded-xl flex items-center gap-4"
          style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.2)' }}
        >
          <div className="w-8 text-center font-rajdhani font-bold text-lg" style={{ color: '#FF8C00' }}>47</div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.25)' }}>
            🎮
          </div>
          <div className="flex-1">
            <div className="font-rajdhani font-bold text-white flex items-center gap-2">
              Вы <span className="text-xs font-rubik font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(ваша позиция)</span>
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>32 апгрейда · 56% побед</div>
          </div>
          <div className="text-right">
            <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF8C00' }}>+{formatPrice(12450)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
