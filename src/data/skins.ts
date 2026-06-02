export type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'gold';

export interface Skin {
  id: string;
  name: string;
  weapon: string;
  price: number;
  rarity: Rarity;
  wear: string;
  image: string;
  float: number;
}

export const MOCK_SKINS: Skin[] = [
  { id: '1', name: 'Asiimov', weapon: 'AWP', price: 4200, rarity: 'covert', wear: 'Field-Tested', image: '🎯', float: 0.24 },
  { id: '2', name: 'Fade', weapon: 'M9 Bayonet', price: 18500, rarity: 'gold', wear: 'Factory New', image: '🔪', float: 0.02 },
  { id: '3', name: 'Neo-Noir', weapon: 'AWP', price: 2800, rarity: 'classified', wear: 'Minimal Wear', image: '🎯', float: 0.10 },
  { id: '4', name: 'Hyper Beast', weapon: 'M4A1-S', price: 3100, rarity: 'covert', wear: 'Field-Tested', image: '🔫', float: 0.22 },
  { id: '5', name: 'Doppler', weapon: 'Karambit', price: 22000, rarity: 'gold', wear: 'Factory New', image: '🔪', float: 0.01 },
  { id: '6', name: 'Neon Rider', weapon: 'AK-47', price: 1850, rarity: 'classified', wear: 'Field-Tested', image: '🔫', float: 0.18 },
  { id: '7', name: 'Dragon Lore', weapon: 'AWP', price: 95000, rarity: 'covert', wear: 'Field-Tested', image: '🐉', float: 0.31 },
  { id: '8', name: 'Vulcan', weapon: 'AK-47', price: 6700, rarity: 'covert', wear: 'Factory New', image: '🔫', float: 0.04 },
  { id: '9', name: 'Icarus Fell', weapon: 'Flip Knife', price: 2400, rarity: 'restricted', wear: 'Minimal Wear', image: '🔪', float: 0.13 },
  { id: '10', name: 'Printstream', weapon: 'Glock-18', price: 890, rarity: 'classified', wear: 'Factory New', image: '🔫', float: 0.03 },
  { id: '11', name: 'Case Hardened', weapon: 'AK-47', price: 1200, rarity: 'restricted', wear: 'Well-Worn', image: '🔫', float: 0.43 },
  { id: '12', name: 'Howl', weapon: 'M4A4', price: 115000, rarity: 'covert', wear: 'Field-Tested', image: '🐺', float: 0.28 },
];

export const RARITY_LABELS: Record<Rarity, string> = {
  consumer: 'Потребительское',
  industrial: 'Промышленное',
  milspec: 'Военное',
  restricted: 'Запрещённое',
  classified: 'Засекреченное',
  covert: 'Тайное',
  gold: '★ Редкое',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  consumer: '#B0C3D9',
  industrial: '#5E98D9',
  milspec: '#4B69FF',
  restricted: '#8847FF',
  classified: '#D32CE6',
  covert: '#EB4B4B',
  gold: '#E4AE39',
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
};
