import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { AdBanner } from './components/AdBanner';
import Shop from './components/Shop';
import Rewards from './components/Rewards';
import { themes } from './data/themes';
import { collectibles } from './data/collectibles';
import { Store, Coins, TreePine } from 'lucide-react';
import type { Theme, Collectible } from './types';

// Test AdSense Client ID - Replace with real client ID in production
const ADSENSE_CLIENT_ID = 'ca-pub-3940256099942544';

// Local storage keys
const STORAGE_KEYS = {
  COINS: 'forest-focus-coins',
  COLLECTION: 'forest-focus-collection',
  THEME: 'forest-focus-theme',
  SESSIONS: 'forest-focus-sessions'
};

function App() {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COINS);
    return saved ? parseInt(saved) : 0;
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem(STORAGE_KEYS.THEME);
    return themes.find(t => t.id === savedThemeId) || themes[0];
  });

  const [collection, setCollection] = useState<Collectible[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    return saved ? JSON.parse(saved) : [];
  });

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? parseInt(saved) : 0;
  });

  const [showShop, setShowShop] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  // Persist data when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, completedSessions.toString());
  }, [completedSessions]);

  const handleAdComplete = (reward: number) => {
    setCoins(prev => prev + reward);
  };

  const handleSessionComplete = () => {
    setCompletedSessions(prev => prev + 1);
    
    // Random chance to get a collectible (30% chance)
    if (Math.random() < 0.3) {
      const availableCollectibles = collectibles.filter(c => !collection.some(owned => owned.id === c.id));
      if (availableCollectibles.length > 0) {
        const randomCollectible = availableCollectibles[Math.floor(Math.random() * availableCollectibles.length)];
        setCollection(prev => [...prev, { ...randomCollectible, acquired: true }]);
      }
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundImage: `url(${currentTheme.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">{coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">{completedSessions} sessions</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCollection(!showCollection)}
                className={`${currentTheme.style.button} ${currentTheme.style.accent} px-4 py-2`}
              >
                Collection ({collection.length})
              </button>
              <button
                onClick={() => setShowShop(true)}
                className={`${currentTheme.style.button} ${currentTheme.style.accent} px-4 py-2`}
              >
                <Store className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowRewards(true)}
                className={`${currentTheme.style.button} ${currentTheme.style.accent} px-4 py-2`}
              >
                Rewards
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 pt-24 pb-32 flex flex-col md:flex-row gap-8 items-start">
          {/* Timer Section */}
          <div className="w-full md:w-2/3">
            <Timer 
              themeStyle={currentTheme.style} 
              onSessionComplete={handleSessionComplete}
            />
          </div>

          {/* Ad Section */}
          <div className="w-full md:w-1/3 sticky top-24">
            <AdBanner 
              onAdComplete={handleAdComplete} 
              themeStyle={currentTheme.style}
              clientId={ADSENSE_CLIENT_ID}
            />
          </div>
        </div>

        {/* Modals */}
        {showCollection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`${currentTheme.style.panel} bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-white font-semibold">Your Collection</h2>
                <button onClick={() => setShowCollection(false)} className="text-white">×</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collection.map((item) => (
                  <div key={item.id} className="bg-white/10 p-4 rounded-xl text-center">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="text-white font-medium">{item.name}</div>
                    <div className="text-white/60 text-sm">{item.rarity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showShop && (
          <Shop
            onClose={() => setShowShop(false)}
            coins={coins}
            setCoins={setCoins}
            selectedTheme={currentTheme.id}
            setSelectedTheme={(themeId) => {
              const theme = themes.find(t => t.id === themeId);
              if (theme) setCurrentTheme(theme);
            }}
            collection={collection}
            setCollection={setCollection}
          />
        )}

        {showRewards && (
          <Rewards
            onClose={() => setShowRewards(false)}
            coins={coins}
            setCoins={setCoins}
          />
        )}
      </div>
    </div>
  );
}

export default App;