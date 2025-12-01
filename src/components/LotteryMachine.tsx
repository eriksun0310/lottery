'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Participant, Winner, LotteryConfig } from '@/types';
import { selectWinners } from '@/utils/parser';

interface LotteryMachineProps {
  config: LotteryConfig;
  participants: Participant[];
  onComplete: (winners: Winner[]) => void;
}

export default function LotteryMachine({
  config,
  participants,
  onComplete,
}: LotteryMachineProps) {
  const [displayName, setDisplayName] = useState('');
  const [isSpinning, setIsSpinning] = useState(true);
  const [finalWinners, setFinalWinners] = useState<Winner[]>([]);
  const [isReady, setIsReady] = useState(false);
  const winnersRef = useRef<Winner[]>([]);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00D4FF', '#A855F7', '#EC4899', '#FFD700', '#10B981'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00D4FF', '#A855F7', '#EC4899', '#FFD700', '#10B981'],
      });
    }, 250);
  };

  // Initialize winners on mount
  useEffect(() => {
    const winners = selectWinners(participants, config.winnerCount);
    const winnersWithOrder: Winner[] = winners.map((w, i) => ({
      ...w,
      prizeOrder: i + 1,
    }));
    winnersRef.current = winnersWithOrder;
    setFinalWinners(winnersWithOrder);
    setIsReady(true);
  }, [participants, config.winnerCount]);

  // Start animation after ready
  useEffect(() => {
    if (!isReady || participants.length === 0) return;

    // Set initial display name
    setDisplayName(participants[Math.floor(Math.random() * participants.length)].name);

    // Spinning animation - show random names
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setDisplayName(participants[randomIndex].name);
    }, 50);

    // Stop spinning after 3 seconds
    const stopTimeout = setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      fireConfetti();

      // Complete after showing results
      setTimeout(() => {
        onComplete(winnersRef.current);
      }, 2000);
    }, 3000);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stopTimeout);
    };
  }, [isReady, participants, onComplete]);

  if (!isReady) {
    return (
      <div className="text-center text-cyan-400">
        載入中...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto text-center space-y-8"
    >
      {/* Event & Prize Info */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{config.eventName}</h2>
        <p className="text-xl text-purple-400">
          {config.prizeName} - 共 {config.winnerCount} 名
        </p>
      </div>

      {/* Spinning Display - Only show during animation */}
      {isSpinning && (
        <div className="relative">
          <div
            className="bg-slate-800/80 border-4 border-cyan-500 rounded-2xl p-8
                       shadow-[0_0_30px_rgba(0,212,255,0.5),inset_0_0_30px_rgba(0,212,255,0.1)]"
          >
            <div className="overflow-hidden h-24 flex items-center justify-center">
              <motion.div
                key={displayName}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.05 }}
                className="text-4xl md:text-5xl font-bold text-cyan-400"
              >
                {displayName || '...'}
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
        </div>
      )}

      {/* Winners Grid - Show after spinning stops */}
      {!isSpinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div
            className="bg-slate-800/80 border-4 border-yellow-500 rounded-2xl p-6
                       shadow-[0_0_30px_rgba(255,215,0,0.5),inset_0_0_30px_rgba(255,215,0,0.1)]"
          >
            <div className="grid gap-3" style={{
              gridTemplateColumns: `repeat(${Math.min(finalWinners.length, 3)}, 1fr)`
            }}>
              {finalWinners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-xl border-2 border-yellow-500/50
                             bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
                >
                  <div className="text-xs text-yellow-400/70 mb-1">
                    #{winner.prizeOrder}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-yellow-400
                                  drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] truncate">
                    {winner.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
        </motion.div>
      )}

      {/* Status */}
      <div className="text-lg">
        {isSpinning ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-cyan-400"
          >
            🎰 抽獎中...
          </motion.span>
        ) : (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-yellow-400 text-2xl"
          >
            🎉 恭喜以上 {finalWinners.length} 位中獎！
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
