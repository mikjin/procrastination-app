import React, { useEffect, useRef, useState } from 'react';
import { Coins, Play } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  onAdComplete: (reward: number) => void;
  themeStyle: {
    primary: string;
    accent: string;
    button: string;
    panel: string;
  };
  clientId: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ onAdComplete, themeStyle, clientId }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const videoAdRef = useRef<HTMLDivElement>(null);
  const bannerAdRef = useRef<HTMLDivElement>(null);
  const bannerRefreshInterval = useRef<NodeJS.Timeout>();

  // Test ad units
  const TEST_AD_UNITS = {
    video: '8691650741',   // Test Video Ad
    banner: '2077070354',  // Test Banner Ad
  };

  useEffect(() => {
    loadBannerAd();
    
    // Refresh banner ad every 60 seconds
    bannerRefreshInterval.current = setInterval(() => {
      loadBannerAd();
    }, 60000);

    return () => {
      if (bannerRefreshInterval.current) {
        clearInterval(bannerRefreshInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const loadBannerAd = () => {
    if (!bannerAdRef.current) return;

    bannerAdRef.current.innerHTML = '';
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.style.width = '100%';
    adElement.style.height = '100px';
    adElement.setAttribute('data-ad-client', clientId);
    adElement.setAttribute('data-ad-slot', TEST_AD_UNITS.banner);
    adElement.setAttribute('data-ad-format', 'auto');
    adElement.setAttribute('data-full-width-responsive', 'true');

    bannerAdRef.current.appendChild(adElement);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      onAdComplete(1); // Reward 1 coin for successful banner load
    } catch (error) {
      console.error('Error loading banner ad:', error);
    }
  };

  const loadVideoAd = () => {
    if (!videoAdRef.current) return;

    videoAdRef.current.innerHTML = '';
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.style.width = '100%';
    adElement.style.height = '360px';
    adElement.setAttribute('data-ad-client', clientId);
    adElement.setAttribute('data-ad-slot', TEST_AD_UNITS.video);
    adElement.setAttribute('data-ad-format', 'video');

    videoAdRef.current.appendChild(adElement);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (error) {
      console.error('Error loading video ad:', error);
      setAdLoaded(false);
    }
  };

  const handleWatchAd = () => {
    if (cooldown > 0) return;

    setIsWatchingAd(true);
    loadVideoAd();

    // Simulate video ad completion after 30 seconds
    setTimeout(() => {
      setIsWatchingAd(false);
      onAdComplete(5); // Reward 5 coins for video ad
      setCooldown(300); // 5 minutes cooldown for video ads
      setAdLoaded(false);
    }, 30000);
  };

  return (
    <div className="space-y-4">
      <div className={`${themeStyle.panel} bg-white/10 backdrop-blur-md p-4`}>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleWatchAd}
            disabled={isWatchingAd || cooldown > 0}
            className={`${themeStyle.button} ${
              isWatchingAd || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : themeStyle.accent
            } px-4 py-2 flex items-center gap-2 justify-center`}
          >
            {isWatchingAd ? (
              <Play className="h-5 w-5" />
            ) : (
              <Coins className="h-5 w-5" />
            )}
            {isWatchingAd 
              ? 'Watching Video...' 
              : cooldown > 0 
                ? `Wait ${Math.floor(cooldown / 60)}m ${cooldown % 60}s` 
                : 'Watch Video Ad (+5 coins)'}
          </button>

          <div 
            ref={videoAdRef}
            className={`w-full transition-all duration-300 ${
              isWatchingAd ? 'h-[360px] opacity-100' : 'h-0 opacity-0'
            }`}
          />
        </div>
      </div>

      <div className={`${themeStyle.panel} bg-white/10 backdrop-blur-md p-4`}>
        <div
          ref={bannerAdRef}
          className="w-full h-[100px] bg-white/5 rounded-lg"
        />
      </div>
    </div>
  );
};