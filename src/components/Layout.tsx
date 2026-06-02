import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'upgrade', label: 'Апгрейд', icon: 'Zap' },
  { id: 'inventory', label: 'Инвентарь', icon: 'Package' },
  { id: 'history', label: 'История', icon: 'Clock' },
  { id: 'leaderboard', label: 'Рейтинг', icon: 'Trophy' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
];

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const balance = 12450;

  return (
    <div className="min-h-screen noise-bg" style={{ backgroundColor: 'var(--bg-deep)' }}>
      {/* Top navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-16"
        style={{
          background: 'linear-gradient(180deg, rgba(7,12,24,0.98) 0%, rgba(7,12,24,0.90) 100%)',
          borderBottom: '1px solid rgba(255,140,0,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #FF8C00, #FF4500)', color: '#070C18' }}
          >
            SR
          </div>
          <span
            className="font-rajdhani font-bold text-xl tracking-widest animate-neon-flicker hidden sm:block"
            style={{ color: '#FF8C00' }}
          >
            SKIN<span style={{ color: '#FFFFFF' }}>RUSH</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePage === item.id
                  ? 'text-[#FF8C00] bg-[rgba(255,140,0,0.08)]'
                  : 'text-[rgba(255,255,255,0.55)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              style={activePage === item.id ? { fontFamily: 'Rajdhani', fontWeight: 700 } : { fontFamily: 'Rubik' }}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Balance */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}
          >
            <Icon name="DollarSign" size={14} className="text-[#FF8C00]" />
            <span className="font-rajdhani font-bold text-sm" style={{ color: '#FF8C00' }}>
              {balance.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[rgba(255,255,255,0.06)]">
            <Icon name="Bell" size={18} className="text-[rgba(255,255,255,0.6)]" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#FF8C00' }}
            />
          </button>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,140,0,0.3), rgba(255,69,0,0.3))',
              border: '1px solid rgba(255,140,0,0.4)',
              color: '#FF8C00',
              fontFamily: 'Rajdhani',
            }}
            onClick={() => onNavigate('profile')}
          >
            ПЛ
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)]"
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(7,12,24,0.95)', backdropFilter: 'blur(20px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div className="pt-20 px-6" onClick={e => e.stopPropagation()}>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
              style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}
            >
              <Icon name="DollarSign" size={16} className="text-[#FF8C00]" />
              <span className="font-rajdhani font-bold" style={{ color: '#FF8C00' }}>
                Баланс: {balance.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activePage === item.id
                      ? 'text-[#FF8C00] bg-[rgba(255,140,0,0.1)]'
                      : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-rajdhani font-bold text-lg">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
