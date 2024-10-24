import React from 'react';
import { X, Coins } from 'lucide-react';

interface RewardsProps {
  onClose: () => void;
  coins: number;
  setCoins: (coins: number) => void;
}

export const Rewards: React.FC<RewardsProps> = ({ onClose, coins }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md w-full text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Rewards</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl mb-4">
            <span className="text-lg">Available Coins</span>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-xl font-bold">{coins}</span>
            </div>
          </div>

          <div className="p-4 bg-white/10 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">How to earn coins:</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Watch video ads (+5 coins)</li>
              <li>• View banner ads (+1 coin)</li>
              <li>• Use coins to unlock new themes and collectibles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;