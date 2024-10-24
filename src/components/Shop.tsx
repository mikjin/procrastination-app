import React, { useState } from 'react';
import { X, TreePine, Shell, Sparkles } from 'lucide-react';
import { themes } from '../data/themes';
import { collectibles } from '../data/collectibles';
import type { Theme, Collectible } from '../types';

interface ShopProps {
  onClose: () => void;
  coins: number;
  setCoins: (coins: number) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  collection: Collectible[];
  setCollection: (collection: Collectible[]) => void;
}

const Shop = ({ 
  onClose, 
  coins, 
  setCoins, 
  selectedTheme, 
  setSelectedTheme,
  collection,
  setCollection 
}: ShopProps) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'collectibles'>('themes');
  const [activeCategory, setActiveCategory] = useState<'all' | Theme['category']>('all');

  const filteredThemes = themes.filter(theme => 
    activeCategory === 'all' || theme.category === activeCategory
  );

  const handlePurchase = (themeId: string, price: number) => {
    if (coins >= price) {
      setSelectedTheme(themeId);
      setCoins(coins - price);
    }
  };

  const handleCollectiblePurchase = (collectibleId: string) => {
    const collectible = collectibles.find(c => c.id === collectibleId);
    if (collectible && collectible.price && coins >= collectible.price && !collection.find(c => c.id === collectibleId)) {
      setCoins(coins - collectible.price);
      setCollection([...collection, { ...collectible, acquired: true }]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-2xl w-full text-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Shop</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'themes' ? 'bg-green-600/80' : 'bg-white/10'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveTab('collectibles')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'collectibles' ? 'bg-green-600/80' : 'bg-white/10'
            }`}
          >
            Collectibles
          </button>
        </div>

        {activeTab === 'themes' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'forest', 'ocean', 'holiday'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as any)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === category ? 'bg-green-600/80' : 'bg-white/10'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredThemes.map((theme) => (
                <div key={theme.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                  <div>
                    <span className="font-medium">{theme.name}</span>
                    <p className="text-sm text-gray-300">{theme.category}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(theme.id, theme.price)}
                    disabled={selectedTheme === theme.id || coins < theme.price}
                    className={`px-4 py-2 rounded-full ${
                      selectedTheme === theme.id
                        ? 'bg-green-600/50 cursor-not-allowed'
                        : coins < theme.price
                        ? 'bg-gray-600/50 cursor-not-allowed'
                        : 'bg-green-600/80 hover:bg-green-700/80'
                    } transition`}
                  >
                    {selectedTheme === theme.id ? 'Selected' : `${theme.price} coins`}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'collectibles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectibles.map((collectible) => {
              const isOwned = collection.some(c => c.id === collectible.id);
              return (
                <div key={collectible.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{collectible.image}</span>
                    <div>
                      <span className="font-medium">{collectible.name}</span>
                      <p className="text-sm text-gray-300">
                        {collectible.type} • {collectible.rarity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCollectiblePurchase(collectible.id)}
                    disabled={isOwned || (collectible.price ? coins < collectible.price : false)}
                    className={`px-4 py-2 rounded-full ${
                      isOwned
                        ? 'bg-green-600/50 cursor-not-allowed'
                        : coins < (collectible.price || 0)
                        ? 'bg-gray-600/50 cursor-not-allowed'
                        : 'bg-green-600/80 hover:bg-green-700/80'
                    } transition`}
                  >
                    {isOwned ? 'Owned' : `${collectible.price} coins`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;