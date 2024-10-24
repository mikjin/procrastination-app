export interface Theme {
  id: string;
  name: string;
  category: 'forest' | 'ocean' | 'holiday';
  price: number;
  background: string;
  style: {
    primary: string;
    accent: string;
    button: string;
    panel: string;
  };
}

export interface Collectible {
  id: string;
  name: string;
  type: string;
  rarity: 'common' | 'rare' | 'epic';
  image: string;
  acquired: boolean;
  price: number;
}