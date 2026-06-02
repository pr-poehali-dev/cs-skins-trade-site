import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_SKINS, formatPrice, RARITY_COLORS } from '@/data/skins';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const LIVE_FEED = [
  { user: 'Phantom_x7', skin: 'AWP | Asiimov', from: 2800, to: 4200, won: true, time: '1с назад' },
  { user: 'DarkMatter99', skin: 'Karambit | Fade', from: 12000, to: 22000, won: true, time: '4с назад' },
  { user: 'SniperElite', skin: 'AK-47 | Vulcan', from: 5000, to: 3100, won: false, time: '8с назад' },
  { user: 'NightOwl_CS', skin: 'M4A4 | Howl', from: 80000, to: 115000, won: true, time: '12с назад' },
  { user: 'Reactor_33', skin: 'Glock | Printstream', from: 600, to: 890, won: true, time: '19с назад' },
  { user: 'GhostFire', skin: 'AWP | Dragon Lore', from: 70000, to: 95000, won: true, time: '25с назад' },
];

const STATS = [
  { label: 'Апгрейдов сегодня', value: '24,891', icon: 'Zap', color: '#FF8C00' },
  { label: 'Выплачено за неделю', value: '₽ 18.4М', icon: 'TrendingUp', color: '#00FF88' },
  { label: 'Онлайн сейчас', value: '3,247', icon: 'Users', color: '#00C8FF' },
  { label: 'Скинов в базе', value: '47,000+', icon: 'Package', color: '#8847FF' },
];

export default function Home({ onNavigate }: HomeProps) {
  const [feedIndex, setFeedIndex] = useState(0);
  const [visibleFeed, setVisibleFeed] = useState(LIVE_FEED.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex(i => (i + 1) % LIVE_FEED.length);
      setVisibleFeed(prev => {
        const newItem = LIVE_FEED[(feedIndex + 1) % LIVE_FEED.length];
        return [newItem, ...prev.slice(0, 3)];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [feedIndex]);

  const topSkins = MOCK_SKINS.slice(0, 6);

  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4">
        {/* Ambient glows */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 animate-fade-in-up"
            style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.25)', color: '#FF8C00' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            3,247 игроков онлайн прямо сейчас
          </div>

          <h1
            className="font-rajdhani font-bold leading-none mb-4 animate-fade-in-up"
            style={{ fontSize: 'clamp(42px, 8vw, 88px)', animationDelay: '0.1s', opacity: 0 }}
          >
            <span style={{ color: '#FFFFFF' }}>АПГРЕЙД</span>{' '}
            <span style={{ color: '#FF8C00', textShadow: '0 0 40px rgba(255,140,0,0.5)' }}>СКИНОВ</span>
            <br />
            <span style={{ color: '#FFFFFF' }}>CS2 НА </span>
            <span style={{ color: '#00FF88', textShadow: '0 0 40px rgba(0,255,136,0.4)' }}>РЕАЛЬНЫЕ</span>
            <br />
            <span style={{ color: '#FFFFFF' }}>ДЕНЬГИ</span>
          </h1>

          <p
            className="text-lg mb-8 max-w-xl mx-auto animate-fade-in-up"
            style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.2s', opacity: 0 }}
          >
            Ставь свои скины — получай скины дороже. Честная система, мгновенный вывод, интеграция со Steam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <button
              onClick={() => onNavigate('upgrade')}
              className="btn-glow px-8 py-4 rounded-xl text-lg flex items-center gap-2 justify-center glow-orange"
            >
              <Icon name="Zap" size={20} />
              Начать апгрейд
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="px-8 py-4 rounded-xl text-lg flex items-center gap-2 justify-center transition-all hover:bg-[rgba(255,255,255,0.06)]"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
            >
              <Icon name="Package" size={20} />
              Мой инвентарь
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="skin-card p-4 text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${stat.color}18` }}
              >
                <Icon name={stat.icon} size={20} style={{ color: stat.color }} />
              </div>
              <div className="font-rajdhani font-bold text-xl" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column section */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* Live feed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              <h2 className="font-rajdhani font-bold text-xl text-white">Прямой эфир апгрейдов</h2>
            </div>
            <div className="space-y-2">
              {visibleFeed.map((item, i) => (
                <div
                  key={`${item.user}-${i}`}
                  className="skin-card px-4 py-3 flex items-center justify-between animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: item.won ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)',
                        color: item.won ? '#00FF88' : '#FF3B3B',
                        border: `1px solid ${item.won ? 'rgba(0,255,136,0.25)' : 'rgba(255,59,59,0.25)'}`,
                      }}
                    >
                      {item.won ? '↑' : '↓'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.user}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.skin}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-sm font-rajdhani font-bold"
                      style={{ color: item.won ? '#00FF88' : '#FF3B3B' }}
                    >
                      {item.won ? '+' : '-'}{formatPrice(Math.abs(item.to - item.from))}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Как это работает</h2>
            <div className="space-y-3">
              {[
                { step: '01', title: 'Подключи Steam', desc: 'Авторизуйся через Steam API — твои скины подтягиваются автоматически', icon: 'Link' },
                { step: '02', title: 'Выбери скин для апгрейда', desc: 'Укажи скин-ставку из инвентаря и желаемый скин-цель', icon: 'Package' },
                { step: '03', title: 'Запусти апгрейд', desc: 'Алгоритм рассчитает шанс победы на основе разницы цен', icon: 'Zap' },
                { step: '04', title: 'Получи выигрыш', desc: 'При победе скин мгновенно поступает в твой инвентарь', icon: 'Trophy' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="skin-card p-4 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-rajdhani font-bold text-sm"
                    style={{ background: 'rgba(255,140,0,0.1)', color: '#FF8C00', border: '1px solid rgba(255,140,0,0.2)' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className="font-rajdhani font-bold text-white text-base">{item.title}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular skins */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-rajdhani font-bold text-2xl text-white">Популярные цели апгрейда</h2>
            <button
              onClick={() => onNavigate('upgrade')}
              className="text-sm flex items-center gap-1 transition-colors hover:text-white"
              style={{ color: '#FF8C00', fontFamily: 'Rajdhani', fontWeight: 600 }}
            >
              Все скины <Icon name="ArrowRight" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topSkins.map(skin => (
              <div
                key={skin.id}
                className={`skin-card rarity-${skin.rarity} p-3 cursor-pointer`}
                onClick={() => onNavigate('upgrade')}
              >
                <div
                  className="w-full aspect-square rounded-xl flex items-center justify-center text-4xl mb-2"
                  style={{ background: `${RARITY_COLORS[skin.rarity]}12` }}
                >
                  {skin.image}
                </div>
                <div
                  className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mb-1 rarity-tag-${skin.rarity}`}
                >
                  {skin.wear}
                </div>
                <div className="font-rajdhani font-bold text-sm text-white leading-tight">
                  {skin.weapon}
                </div>
                <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {skin.name}
                </div>
                <div className="font-rajdhani font-bold text-sm" style={{ color: '#FF8C00' }}>
                  {formatPrice(skin.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
