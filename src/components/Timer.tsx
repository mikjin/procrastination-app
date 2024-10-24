import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface TimerProps {
  themeStyle: {
    primary: string;
    accent: string;
    button: string;
    panel: string;
  };
  onSessionComplete: () => void;
}

export const Timer: React.FC<TimerProps> = ({ themeStyle, onSessionComplete }) => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customTime, setCustomTime] = useState(25);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [breakTime, setBreakTime] = useState(5);
  const [autoStartBreak, setAutoStartBreak] = useState(true);

  const startSession = useCallback((type: 'focus' | 'break') => {
    setSessionType(type);
    setTime(type === 'focus' ? customTime * 60 : breakTime * 60);
    setIsRunning(true);
  }, [customTime, breakTime]);

  useEffect(() => {
    // Update timer immediately when customTime changes
    if (sessionType === 'focus') {
      setTime(customTime * 60);
      setIsRunning(false);
    }
  }, [customTime, sessionType]);

  useEffect(() => {
    // Update break timer when breakTime changes
    if (sessionType === 'break') {
      setTime(breakTime * 60);
      setIsRunning(false);
    }
  }, [breakTime, sessionType]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      if (sessionType === 'focus') {
        onSessionComplete();
        if (autoStartBreak) {
          startSession('break');
        }
      } else {
        startSession('focus');
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, sessionType, autoStartBreak, onSessionComplete, startSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(sessionType === 'focus' ? customTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionLabel = () => {
    if (sessionType === 'focus') {
      return isRunning ? 'Focus Time' : 'Ready to Focus?';
    }
    return isRunning ? 'Break Time' : 'Take a Break';
  };

  const progress = ((sessionType === 'focus' ? customTime * 60 : breakTime * 60) - time) / (sessionType === 'focus' ? customTime * 60 : breakTime * 60) * 100;

  return (
    <div className={`${themeStyle.panel} bg-white/10 backdrop-blur-md p-8 max-w-md mx-auto text-white relative animate-fade-in`}>
      {/* Progress Ring */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-current text-white/10"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className={`stroke-current text-white transition-all duration-300`}
            strokeWidth="8"
            fill="none"
            strokeDasharray="753.6"
            strokeDashoffset={753.6 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold mb-2 tabular-nums">{formatTime(time)}</div>
          <div className="text-lg opacity-75">{getSessionLabel()}</div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className={`${themeStyle.accent} ${themeStyle.button} p-4 hover:opacity-90 transition-all duration-300`}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <button
          onClick={resetTimer}
          className={`${themeStyle.accent} ${themeStyle.button} p-4 hover:opacity-90 transition-all duration-300`}
        >
          <RotateCcw className="h-6 w-6" />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`${themeStyle.accent} ${themeStyle.button} p-4 hover:opacity-90 transition-all duration-300`}
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {showSettings && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="focusTime">Focus Time (minutes):</label>
            <input
              type="number"
              id="focusTime"
              value={customTime}
              onChange={(e) => setCustomTime(Math.max(1, parseInt(e.target.value) || 1))}
              className={`${themeStyle.button} bg-white/10 px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-white/50`}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label htmlFor="breakTime">Break Time (minutes):</label>
            <input
              type="number"
              id="breakTime"
              value={breakTime}
              onChange={(e) => setBreakTime(Math.max(1, parseInt(e.target.value) || 1))}
              className={`${themeStyle.button} bg-white/10 px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-white/50`}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label htmlFor="autoStartBreak">Auto-start breaks:</label>
            <input
              type="checkbox"
              id="autoStartBreak"
              checked={autoStartBreak}
              onChange={(e) => setAutoStartBreak(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>
      )}
    </div>
  );
};