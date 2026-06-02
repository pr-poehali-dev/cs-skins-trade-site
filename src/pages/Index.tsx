import { useState } from 'react';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Upgrade from '@/pages/Upgrade';
import Inventory from '@/pages/Inventory';
import History from '@/pages/History';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import Support from '@/pages/Support';

type Page = 'home' | 'upgrade' | 'inventory' | 'history' | 'leaderboard' | 'profile' | 'support';

export default function Index() {
  const [activePage, setActivePage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setActivePage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'upgrade': return <Upgrade />;
      case 'inventory': return <Inventory />;
      case 'history': return <History />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile />;
      case 'support': return <Support />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}
